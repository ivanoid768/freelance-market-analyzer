import { SourceCategory } from "shared/src/entity/SourceCategory";
import { Resolver, Query, Authorized, Mutation, Arg, ObjectType, Field, Int, InputType, Args, Ctx, FieldResolver, Root, ArgsType } from "type-graphql";
import { getRepository, In, Repository } from "typeorm";

import { Filter } from "../entity/Filter";
import { Role } from "./auth.api";
import { IContext } from "./types.api";

@ArgsType()
class FilterInput { // implements Partial<Filter>
    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => [Int])
    categories: number[];

    @Field(() => [String])
    positiveKeywords: string[];

    @Field(() => [String])
    negativeKeywords: string[];
}

@ObjectType()
class FiltersResp {
    @Field(() => [Filter])
    filters: Filter[];

    @Field(() => Int)
    total: number;
}

@Resolver() // of => Filter
export class FilterResolver {
    private rep: Repository<Filter>;

    constructor() {
        this.rep = getRepository(Filter);
    }

    @Authorized(Role.UserRole.TRIAL)
    @Query(() => FiltersResp)
    async filters(@Ctx() context: IContext) {
        let filters = await this.rep.find({ where: { user: context.user.id } });

        return {
            filters: filters,
            total: filters.length
        }
    }

    // @FieldResolver()
    // async categories(@Root() filter: Filter) {
    //     const categories = filter.categories

    //     return categories;
    // }

    @Authorized(Role.UserRole.TRIAL)
    @Mutation(() => Filter)
    async createFilter(@Args() input: FilterInput, @Ctx() context: IContext) {
        let newFilter = new Filter();
        newFilter.name = input.name;
        newFilter.positiveKeywords = input.positiveKeywords;
        newFilter.negativeKeywords = input.negativeKeywords;
        newFilter.user = context.user;

        let categories = await getRepository(SourceCategory).find({ where: { id: In(input.categories) } });
        newFilter.categories = categories;

        newFilter = await this.rep.save(newFilter);

        return newFilter;
    }

    @Authorized(Role.UserRole.TRIAL)
    @Mutation(() => Filter)
    async deleteFilter(@Arg('id') id: number) {
        let filter = await this.rep.findOneOrFail(id);

        filter = await this.rep.remove(filter);

        return filter;
    }
}