import { Queue } from "bullmq";

import { queueConnection } from "./index.queue";
import { FLR_TASK_QUEUE, FlrTaskJob } from "shared/src/queue";
import { getRepository } from "typeorm";
import { SourceCategory } from "shared/src/entity/SourceCategory";

const taskQueue = new Queue<FlrTaskJob>(FLR_TASK_QUEUE, { connection: queueConnection });

export async function addTaskJob() {
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
}