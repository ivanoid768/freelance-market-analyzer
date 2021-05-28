---
to: ../parser/src/worker/<%= name %>.worker.ts
---
import { Worker } from "bullmq";

import { <%= h.changeCase.pascalCase(name) %>TaskJob, <%= h.changeCase.upper(name) %>_CATEGORY_QUEUE, <%= h.changeCase.upper(name) %>_TASK_QUEUE } from "shared/src/queue";
import { config } from "src/config";
import { queueConnection } from "./index.worker";

export function start<%= h.changeCase.pascalCase(name) %>CategoryWorker() {
    if (config.RUN_<%= h.changeCase.upper(name) %>_CATEGORY_WORKER) {
        new Worker(<%= h.changeCase.upper(name) %>_CATEGORY_QUEUE, async () => {
            
        }, { connection: queueConnection })
    }
}

export function start<%= h.changeCase.pascalCase(name) %>TaskWorker() {
    if (config.RUN_<%= h.changeCase.upper(name) %>_TASK_WORKER) {
        new Worker<<%= h.changeCase.pascalCase(name) %>TaskJob>(<%= h.changeCase.upper(name) %>_TASK_QUEUE, async ({ data }) => {
            
        }, { connection: queueConnection })
    }
}
