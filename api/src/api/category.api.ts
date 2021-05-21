import { Resolver, Query, Authorized, Mutation, Arg, ObjectType, Field, Int, } from "type-graphql";
import { getRepository, Repository } from "typeorm";

import { SourceCategory } from "shared/src/entity/SourceCategory";
import { Role } from "./auth.api";

@ObjectType()
class CategoryResp {
    @Field(() => [SourceCategory])
    categories: SourceCategory[];

    @Field(() => Int)
    total: number;
}

@Resolver()
export class CategoryResolver {
    private rep: Repository<SourceCategory>;

    constructor() {
        this.rep = getRepository(SourceCategory);
    }

    @Authorized(Role.UserRole.TRIAL)
    @Query(() => CategoryResp)
    async categories(@Arg('searchText', { nullable: true }) searchText: string) {
        let categories = await this.rep.createQueryBuilder()
            .select() // .where('searchText ILIKE :searchTerm', { searchTerm: `%${searchText}%` })
            .where(
                `to_tsvector('simple', SourceCategory.searchText) @@ to_tsquery('simple', :query)`,
                { query: `${searchText}:*` }
            )
            .getMany();

        return {
            categories,
            total: categories.length
        }
    }
}