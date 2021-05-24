import { Resolver, Query, Authorized, Mutation, Arg, ObjectType, Field, Int, InputType, Args, } from "type-graphql";
import { getRepository, Repository } from "typeorm";

import { Tag } from "../entity/Tag";
import { Role } from "./auth.api";

@InputType()
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
    async tags(@Arg('searchText', { nullable: true }) searchText: string) {
        let tags = await this.rep.createQueryBuilder()
            .select()
            .where(
                `to_tsvector('simple', Tag.name) @@ to_tsquery('simple', :query)`,
                { query: `${searchText}:*` }
            )
            .getMany();

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
    async deleteTag(@Arg('id') id: number) {
        let tag = await this.rep.findOneOrFail(id);

        tag = await this.rep.remove(tag);

        return tag;
    }
}