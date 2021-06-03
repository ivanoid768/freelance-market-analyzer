import { Resolver, Query, Authorized, Mutation, Arg, ObjectType, Field, Int, InputType, Args, Ctx, FieldResolver, Root, ArgsType, Subscription } from "type-graphql";
import { FindManyOptions, getRepository, ILike, In, Not, Repository } from "typeorm";

import { Task } from "shared/src/entity/Task";
import { Role } from "./auth.api";
import { IContext } from "./types.api";
import { Filter } from "src/entity/Filter";
import { INewTasksPayload, SUB_NOTIFY_NEW_TASKS } from "src/types.index";

@ArgsType()
class TasksArgs {
    @Field(() => Int, { nullable: true })
    filterId?: number;

    @Field(() => Int, { nullable: true })
    page?: number;

    @Field(() => Int, { nullable: true })
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

@ObjectType()
class Notification {
    @Field(() => [Task])
    tasks: Task[];

    @Field(() => Int)
    total: number;
}

@ArgsType()
class NewTasksNotificationArgs {
    @Field(() => Int)
    filterId!: number;
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
            let filter = await this.filterRep.findOne({ where: { user: context.user.id, id: args.filterId }, relations: ['categories'] });
            if (!filter) {
                throw new Error('invalid_filter_id');
            }

            let ctgIds = filter.categories.map(ctg => ctg.id);

            qb.where("Task.categoryId IN (:...ctgIds)", { ctgIds: ctgIds })

            qb.andWhere(
                `to_tsvector('simple', Task.searchText) @@ to_tsquery('simple', :query)`,
                { query: `${filter.positiveKeywords.map(kw => `${kw}:*`).join(' & ')} & ${filter.negativeKeywords.map(kw => `! ${kw}:*`).join(' & ')}` }
            ) //TODO: .map(kw => `${kw}:*`) - remove? Strict 'word' or suffix 'word' too?
        }

        if (args.page) {
            qb.skip((args.page - 1) * (args.perPage || 30));
        }

        if (args.perPage) {
            qb.take(args.perPage);
        }

        // console.log(qb.getQueryAndParameters());

        let tasks = await qb.getMany();

        return {
            tasks: tasks,
            total: tasks.length,
            page: args.page || 1,
            perPage: args.perPage || tasks.length
        }
    }

    @Authorized(Role.UserRole.TRIAL)
    @Subscription({
        topics: SUB_NOTIFY_NEW_TASKS,
        filter: ({ payload, args, context }: { payload: INewTasksPayload, args: NewTasksNotificationArgs, context: IContext }) => {
            return payload.userId == context.user.id && payload.filterId == args.filterId;
        },
    })
    newTasksNotification(
        @Root() notificationPayload: INewTasksPayload,
        @Args() args: NewTasksNotificationArgs,
        @Ctx() context: IContext
    ): Notification {

        return {
            tasks: notificationPayload.tasks,
            total: notificationPayload.tasks.length
        }
    }

    // @Query(() => String)
    // async subTest() {
    //     let addTaskStart = new Date();
    //     let created = addTaskStart.getTime() + 1000;
    //     let createdDate = new Date(created)
    //     console.log(addTaskStart.getTime(), addTaskStart.toLocaleTimeString());
    //     console.log(created, createdDate.toLocaleTimeString());

    //     let updRes = await getRepository(Task).update({}, { created: createdDate });
    //     console.log("updRes", updRes);

    //     let userEmail = config.MAILER_USER;
    //     let user = await getRepository(User).findOne();
    //     user.email = userEmail;
    //     await getRepository(User).save(user);
    //     console.log("user", user);

    //     await notifyUsersNewJobsByEmail(addTaskStart)

    //     return 'subTest';
    // }
}