import "reflect-metadata";

import { connectDB } from "./index.db";
import { startFlrCategoryWorker, startFlrTaskWorker } from "./worker/flr.worker";

async function main() {
    await connectDB();

    startFlrCategoryWorker();
    startFlrTaskWorker();
}

main().catch(e => console.log(e.message))