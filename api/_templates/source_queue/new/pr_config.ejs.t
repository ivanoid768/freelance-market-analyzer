---
inject: true
to: ../parser/src/config.ts
after: class Config
skip_if: RUN_<%= h.changeCase.upper(name) %>_CATEGORY_WORKER
---
<%
   let UPPER_NAME = h.changeCase.upper(name);
-%>
    readonly RUN_<%= UPPER_NAME %>_CATEGORY_WORKER = env.RUN_<%= UPPER_NAME %>_CATEGORY_WORKER === '1' ? true : false;
    readonly RUN_<%= UPPER_NAME %>_TASK_WORKER = env.RUN_<%= UPPER_NAME %>_TASK_WORKER === '1' ? true : false;
