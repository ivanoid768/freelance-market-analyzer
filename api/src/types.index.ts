import { Task } from "shared/src/entity/Task";

export const SUB_NOTIFY_NEW_TASKS = 'SUB_NOTIFY_NEW_TASKS';

export interface INewTasksPayload {
    userId: number;
    filterId: number;
    tasks: Task[];
}