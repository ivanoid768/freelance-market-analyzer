import { schedule } from "node-cron";

import { config } from "./config";
import { addCategoryJobs } from "./queue/category.queue";
import { addTaskJob } from "./queue/task.queue";

export function startScheduler() {
    if (config.RUN_CATEGORY_JOBS) {
        schedule(config.RUN_CATEGORY_CRON, async () => {
            await addCategoryJobs();
        })
    }

    if (config.RUN_TASK_JOBS) {
        schedule(config.RUN_TASK_CRON, async () => {
            await addTaskJob();
        })
    }
}