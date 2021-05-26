import { Worker } from "bullmq";

import { FlrTaskJob, FLR_CATEGORY_QUEUE, FLR_TASK_QUEUE } from "shared/src/queue";
import { config } from "src/config";
import { getAndSaveCategories, getAndSaveTasks } from "src/parser/flr.parser";
import { queueConnection } from "./index.worker";

export function startFlrCategoryWorker() {
    if (config.RUN_CATEGORY_WORKER) {
        new Worker(FLR_CATEGORY_QUEUE, async () => {
            return getAndSaveCategories();
        }, { connection: queueConnection })
    }
}

export function startFlrTaskWorker() {
    if (config.RUN_TASK_WORKER) {
        new Worker<FlrTaskJob>(FLR_TASK_QUEUE, async ({ data }) => {
            return getAndSaveTasks(data.categoryIds);
        }, { connection: queueConnection })
    }
}