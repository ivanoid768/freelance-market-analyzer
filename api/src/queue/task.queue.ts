import { Queue, QueueEvents } from "bullmq";
import { PubSub } from "apollo-server-express";

import { queueConnection } from "./index.queue";
import { FLR_TASK_QUEUE, FlrTaskJob } from "shared/src/queue";
import { getRepository, Repository } from "typeorm";
import { SourceCategory } from "shared/src/entity/SourceCategory";
import { User } from "src/entity/User";
import { Task } from "shared/src/entity/Task";
import { IMailData, mailer } from "src/mailer";
import { Filter } from "src/entity/Filter";
import { SUB_NOTIFY_NEW_TASKS, INewTasksPayload } from "src/types.index";

let addTaskStart: Date;
export const publisher = new PubSub();

const taskQueue = new Queue<FlrTaskJob>(FLR_TASK_QUEUE, { connection: queueConnection });
const taskQueueEvents = new QueueEvents(FLR_TASK_QUEUE);

export async function addTaskJob() {
    addTaskStart = new Date();

    const CATEGORIES_PER_JOB = 10;

    let categories = await getRepository(SourceCategory).find({ select: ['id'] });
    let jobCategoriesIds: number[] = [];

    for (const category of categories) {
        if (jobCategoriesIds.length < CATEGORIES_PER_JOB) {
            jobCategoriesIds.push(category.id);
        } else {
            await taskQueue.add(`${jobCategoriesIds[0]}`, { categoryIds: jobCategoriesIds });
            jobCategoriesIds = [];
        }
    }

    if (jobCategoriesIds.length > 0) {
        await taskQueue.add(`${jobCategoriesIds[0]}`, { categoryIds: jobCategoriesIds });
    }

    console.info(`Task jobs added. Jobs count:`, await taskQueue.getJobCounts());
}

async function getTasksByFilter(filter: Filter, taskRep: Repository<Task>, fromDate: Date) {
    let qb = taskRep.createQueryBuilder();

    let ctgIds = filter.categories.map(ctg => ctg.id);

    qb.where("Task.categoryId IN (:...ctgIds)", { ctgIds: ctgIds })

    qb.andWhere(
        `to_tsvector('simple', Task.searchText) @@ to_tsquery('simple', :query)`,
        { query: `${filter.positiveKeywords.map(kw => `${kw}:*`).join(' & ')} & ${filter.negativeKeywords.map(kw => `! ${kw}:*`).join(' & ')}` }
    )

    qb.andWhere(`Task.created > to_timestamp(:fromDate)`, { fromDate: Math.floor(fromDate.getTime() / 1000) }); //TODO: timestamptz be better?

    // console.log(qb.getQueryAndParameters());

    let tasks = await qb.getMany();

    return tasks;
}

export async function notifyUsersNewJobsByEmail(addTaskStart: Date) {
    let userRep = getRepository(User);
    let taskRep = getRepository(Task);

    let users = await userRep.find({ relations: ['filters', 'filters.categories'] }); //TODO: streams or chank by chank reading.

    for (const user of users) {
        let mailData: IMailData = {
            email: user.email,
            name: user.email,
            filters: []
        };

        for (const filter of user.filters) {
            let mailFilter = {
                name: filter.name,
                tasks: []
            }

            let tasks = await getTasksByFilter(filter, taskRep, addTaskStart);
            mailFilter.tasks = tasks.map(task => {
                return {
                    name: task.name,
                    url: task.url
                }
            });

            if (tasks.length > 0) {
                let payload: INewTasksPayload = {
                    filterId: filter.id,
                    userId: user.id,
                    tasks: tasks
                }

                publisher.publish(SUB_NOTIFY_NEW_TASKS, payload);
            }

            if (mailFilter.tasks.length > 0) {
                mailData.filters.push(mailFilter);
            }
        }

        if (mailData.filters.length > 0) {
            mailer.sendNewTasks(mailData);
        }
    }
}

taskQueueEvents.on('drained', async (id) => {
    let waitingJobCount = await taskQueue.getJobCountByTypes('active', 'waiting');
    if (waitingJobCount > 0) {
        return; //TODO: wait for all active tasks complete or failed.
    }

    await notifyUsersNewJobsByEmail(addTaskStart);
})

function INewTasksPayload(SUB_NOTIFY_NEW_TASKS: string, INewTasksPayload: any) {
    throw new Error("Function not implemented.");
}
