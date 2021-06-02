// yarn run script src/queue/task.queue.test.ts
import "reflect-metadata";
import { Task } from "shared/src/entity/Task";
import { config } from "src/config";
import { User } from "src/entity/User";
import { getRepository } from "typeorm";

import { connectDB } from "../index.db";
import { notifyUsersNewJobsByEmail } from "./task.queue";

async function main() {
    await connectDB()

    let addTaskStart = new Date();
    let created = addTaskStart.getTime() + 1000;
    let createdDate = new Date(created)
    console.log(addTaskStart.getTime(), addTaskStart.toLocaleTimeString());
    console.log(created, createdDate.toLocaleTimeString());

    let updRes = await getRepository(Task).update({}, { created: createdDate });
    console.log("updRes", updRes);

    let userEmail = config.MAILER_USER;
    let user = await getRepository(User).findOne();
    user.email = userEmail;
    await getRepository(User).save(user);
    console.log("user", user);

    await notifyUsersNewJobsByEmail(addTaskStart)
}

main().catch(e => console.log(e.message, e))