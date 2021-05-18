// yarn run script src/parser/flr.parser.test.ts
import "reflect-metadata";

import { connectDB } from "../index.db";
import { getAndSaveCategories, getAndSaveTasks } from "./flr.parser";

async function main() {
    await connectDB()

    // await getAndSaveCategories()

    await getAndSaveTasks([4797,4799,4801])
}

main().catch(e => console.log(e.message))