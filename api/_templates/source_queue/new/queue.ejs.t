---
inject: true
to: ../shared/src/queue.ts
prepend: true
skip_if: export const <%= h.changeCase.upper(name) %>_CATEGORY_QUEUE
---
export const <%= h.changeCase.upper(name) %>_CATEGORY_QUEUE = '<%= h.changeCase.upper(name) %>_CATEGORY_QUEUE';
export const <%= h.changeCase.upper(name) %>_TASK_QUEUE = '<%= h.changeCase.upper(name) %>_TASK_QUEUE';

export interface <%= h.changeCase.pascalCase(name) %>TaskJob {
    categoryIds: number[];
}
