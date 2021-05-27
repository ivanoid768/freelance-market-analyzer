import { Queue } from "bullmq";

import { queueConnection } from "./index.queue";
import { FLR_CATEGORY_QUEUE } from "shared/src/queue";

const categoryQueue = new Queue(FLR_CATEGORY_QUEUE, { connection: queueConnection });

export async function addCategoryJobs() {
    let job = await categoryQueue.add('category_job', null);
    
    console.info(`Category job added`, job.name, job.data);
}
