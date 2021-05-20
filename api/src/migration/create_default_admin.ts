// yarn run script src/migration/create_default_admin.ts
import "reflect-metadata";

import { getRepository } from "typeorm";

import { config } from "../config";
import { Admin } from "../entity/Admin";

import { connectDB } from "../index.db";

async function main() {
    await connectDB()

    let admin = new Admin();
    admin.login = 'admin';
    admin.password = config.DEFAULT_ADMIN_PASSWORD;

    let rep = getRepository(Admin);
    await rep.save(admin);
}

main().catch(e => console.log(e.message))