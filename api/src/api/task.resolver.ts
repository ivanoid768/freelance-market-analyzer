import { Resolver, Query, Authorized, Mutation, Arg, ObjectType, Field, Int, InputType, Args, Ctx, FieldResolver, Root } from "type-graphql";
import { FindManyOptions, getRepository, ILike, In, Not, Repository } from "typeorm";

import { Task } from "shared/src/entity/Task";
import { Role } from "./auth.api";
import { IContext } from "./types.api";
import { Filter } from "src/entity/Filter";

@InputType()
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
    async tags(@Args() args: TasksArgs, @Ctx() context: IContext): Promise<TasksResp> {
        let findOpts: FindManyOptions<Task> = {};

        if (args.filterId) {
            let filter = await this.filterRep.findOne({ where: { user: context.user.id, id: args.filterId } });
            if (!filter) {
                throw new Error('invalid_filter_id');
            }

            let ctgIds = filter.categories.map(ctg => ctg.id);

            findOpts.where = {
                categoryId: In(ctgIds),
                searchText: [ILike(`%${filter.positiveKeywords}%`), Not(ILike(`%${filter.negativeKeywords}%`))],
            };
        }

        if (args.page) {
            findOpts.skip = (args.page - 1) * (args.perPage || 30);
        }

        if (args.perPage) {
            findOpts.take = args.perPage;
        }

        let tasks = await this.rep.find(findOpts);

        return {
            tasks: tasks,
            total: tasks.length
        }
    }
}