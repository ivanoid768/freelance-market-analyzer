---
to: src/queue/<%= name %>_task.queue.ts
---

import { Queue } from "bullmq";

import { queueConnection } from "./index.queue";
import { <%= h.changeCase.upper(name) %>_TASK_QUEUE, <%= h.changeCase.pascalCase(name) %>TaskJob } from "shared/src/queue";
import { getRepository } from "typeorm";
import { SourceCategory } from "shared/src/entity/SourceCategory";

const taskQueue = new Queue<<%= h.changeCase.pascalCase(name) %>TaskJob>(<%= h.changeCase.upper(name) %>_TASK_QUEUE, { connection: queueConnection });

export async function add<%= h.changeCase.pascalCase(name) %>TaskJob() {
    const CATEGORIES_PER_JOB = 10;

    let categories = await getRepository(SourceCategory).find({ select: ['id'], where: { sourceId: <%= source_id %> } });
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

    console.info(`<%= h.changeCase.upper(name) %> task jobs added. Jobs count:`, await taskQueue.getJobCounts());
}
