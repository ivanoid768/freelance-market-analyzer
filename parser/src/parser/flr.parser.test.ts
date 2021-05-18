import "reflect-metadata";

import { connectDB } from "../index.db";
import { getAndSaveCategories } from "./flr.parser";

async function main() {
    await connectDB()

    await getAndSaveCategories()
}

main().catch(e => console.log(e.message))