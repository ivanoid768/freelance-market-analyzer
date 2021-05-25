import { Resolver, Query, Authorized, Mutation, Arg, ObjectType, Field, Int, InputType, Args, ArgsType, } from "type-graphql";
import { getRepository, Repository } from "typeorm";

import { Tag } from "../entity/Tag";
import { Role } from "./auth.api";

@ArgsType()
class TagInput {
    @Field(() => String)
    name: string;
}

@ObjectType()
class TagsResp {
    @Field(() => [Tag])
    tags: Tag[];

    @Field(() => Int)
    total: number;
}

@Resolver()
export class TagResolver {
    private rep: Repository<Tag>;

    constructor() {
        this.rep = getRepository(Tag);
    }

    @Authorized(Role.UserRole.TRIAL)
    @Query(() => TagsResp)
    async tags(@Arg('searchText', { nullable: true }) searchText?: string) {
        let qb = this.rep.createQueryBuilder() // .select()

        if (searchText) {
            qb.where(
                `to_tsvector('simple', Tag.name) @@ to_tsquery('simple', :query)`,
                { query: `${searchText}:*` }
            )
        }

        let tags = await qb.getMany();

        return {
            tags: tags,
            total: tags.length
        }
    }

    @Authorized(Role.UserRole.TRIAL)
    @Mutation(() => Tag)
    async createTag(@Args() input: TagInput) {
        let newTag = new Tag();
        newTag.name = input.name;

        newTag = await this.rep.save(newTag);

        return newTag;
    }

    @Authorized(Role.UserRole.TRIAL)
    @Mutation(() => Tag)
    async deleteTag(@Arg('id', () => Int) id: number): Promise<Tag> {
        let tag = await this.rep.findOneOrFail(id);
        
        const tagId = tag.id;

        await this.rep.remove(tag);

        return {
            ...tag,
            id: tagId
        }
    }
}