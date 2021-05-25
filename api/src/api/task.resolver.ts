import { Resolver, Query, Authorized, Mutation, Arg, ObjectType, Field, Int, InputType, Args, Ctx, FieldResolver, Root, ArgsType } from "type-graphql";
import { FindManyOptions, getRepository, ILike, In, Not, Repository } from "typeorm";

import { Task } from "shared/src/entity/Task";
import { Role } from "./auth.api";
import { IContext } from "./types.api";
import { Filter } from "src/entity/Filter";

@ArgsType()
class TasksArgs {
    @Field(() => Int)
    filterId?: number;

    @Field(() => Int)
    page?: number;

    @Field(() => Int)
    perPage?: number;
}

@ObjectType()
class TasksResp {
    @Field(() => [Task])
    tasks: Task[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page?: number;

    @Field(() => Int)
    perPage?: number;
}

@Resolver()
export class TaskResolver {
    private rep: Repository<Task>;
    private filterRep: Repository<Filter>;

    constructor() {
        this.rep = getRepository(Task);
        this.filterRep = getRepository(Filter);
    }

    @Authorized(Role.UserRole.TRIAL)
    @Query(() => TasksResp)
    async tasks(@Args() args: TasksArgs, @Ctx() context: IContext): Promise<TasksResp> {
        let qb = this.rep.createQueryBuilder();

        if (args.filterId) {
            let filter = await this.filterRep.findOne({ where: { user: context.user.id, id: args.filterId } });
            if (!filter) {
                throw new Error('invalid_filter_id');
            }

            let ctgIds = filter.categories.map(ctg => ctg.id);

            qb.where("Task.categoryId IN (:...ctgIds)", { ctgIds: ctgIds })

            qb.andWhere(
                `to_tsvector('simple', Task.searchText) @@ to_tsquery('simple', :query)`,
                { query: `${filter.positiveKeywords.join(' & ')}` }
            )

            qb.andWhere(
                `to_tsvector('simple', Task.searchText) @@ to_tsquery('simple', :query)`,
                { query: `${filter.negativeKeywords.map(kw=>`! ${kw}`).join(' & ')}` }
            )
        }

        if (args.page) {
            qb.skip((args.page - 1) * (args.perPage || 30));
        }

        if (args.perPage) {
            qb.take(args.perPage);
        }

        let tasks = await qb.getMany();

        return {
            tasks: tasks,
            total: tasks.length,
            page: args.page,
            perPage: args.perPage || tasks.length
        }
    }
}