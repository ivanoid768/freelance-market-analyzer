---
inject: true
to: src/schedule.ts
after: export function startScheduler()
skip_if: config.RUN_<%= h.changeCase.upper(name) %>_CATEGORY_JOBS
---
<%
   const UPPER_NAME = h.changeCase.upper(name);
-%>
   if (config.RUN_<%= UPPER_NAME %>_CATEGORY_JOBS) {
        schedule(config.RUN_<%= UPPER_NAME %>_CATEGORY_CRON, async () => {
            // await addCategoryJobs();
        })
    }

    if (config.RUN_<%= UPPER_NAME %>_TASK_JOBS) {
        schedule(config.RUN_<%= UPPER_NAME %>_TASK_CRON, async () => {
            // await addTaskJob();
        })
    }
