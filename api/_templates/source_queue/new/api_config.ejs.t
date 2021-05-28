---
inject: true
to: src/config.ts
after: class Config
skip_if: RUN_<%= h.changeCase.upper(name) %>_CATEGORY_JOBS
---
<%
   const UPPER_NAME = h.changeCase.upper(name);
-%>
    readonly RUN_<%= UPPER_NAME %>_CATEGORY_JOBS = env.RUN_<%= UPPER_NAME %>_CATEGORY_JOBS === '1' ? true : false;
    readonly RUN_<%= UPPER_NAME %>_TASK_JOBS = env.RUN_<%= UPPER_NAME %>_TASK_JOBS === '1' ? true : false;
    readonly RUN_<%= UPPER_NAME %>_CATEGORY_CRON = env.RUN_<%= UPPER_NAME %>_CATEGORY_CRON || '0 0 * * 0';
    readonly RUN_<%= UPPER_NAME %>_TASK_CRON = env.RUN_<%= UPPER_NAME %>_TASK_CRON || '0 * * * *';
