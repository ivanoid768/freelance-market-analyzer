import "reflect-metadata";
import { connectDB } from "./index.db";

async function main() {
    await connectDB()
}

main().catch(e => console.log(e.message))