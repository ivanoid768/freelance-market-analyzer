// yarn run script src/queue/task.queue.test.ts
import "reflect-metadata";
import { Task } from "shared/src/entity/Task";
import { User } from "src/entity/User";
import { getRepository } from "typeorm";

import { connectDB } from "../index.db";
import { notifyUsersNewJobsByEmail } from "./task.queue";

async function main() {
    await connectDB()

    let addTaskStart = new Date();
    let created = addTaskStart.getTime() + 500;
    // created = Math.floor(created / 1000)
    console.log(addTaskStart.getTime());
    console.log(created);

    let updRes = await getRepository(Task).update({}, { created: created });
    console.log("updRes", updRes);

    let userEmal = 'user@mail.com';
    updRes = await getRepository(User).update({}, { email: userEmal });
    console.log("updResUsers", updRes);

    await notifyUsersNewJobsByEmail(addTaskStart)
}

main().catch(e => console.log(e.message, e))