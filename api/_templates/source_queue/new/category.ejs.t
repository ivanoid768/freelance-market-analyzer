---
to: src/queue/<%= name %>_category.queue.ts
---
import { Queue } from "bullmq";

import { queueConnection } from "./index.queue";
import { <%= h.changeCase.upper(name) %>_CATEGORY_QUEUE } from "shared/src/queue";

const <%= name %>CategoryQueue = new Queue(<%= h.changeCase.upper(name) %>_CATEGORY_QUEUE, { connection: queueConnection });

export async function add<%= name %>CategoryJobs() {
    let job = await <%= name %>CategoryQueue.add('category_job', null);
    
    console.info(`<%= h.changeCase.upper(name) %> category job added`, job.name, job.data);
}
