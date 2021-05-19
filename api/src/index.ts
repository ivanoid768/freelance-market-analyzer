import "reflect-metadata";

import { startServer } from "./api/server.api";
import { connectDB } from "./index.db";

async function main() {
    await connectDB();
    
    startServer();
}

main().catch(e => console.log(e.message))