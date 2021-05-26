import "reflect-metadata";

import { startServer } from "./api/server.api";
import { connectDB } from "./index.db";
import { startScheduler } from "./schedule";

async function main() {
    await connectDB();
    
    startServer();

    startScheduler();
}

main().catch(e => console.log(e.message))