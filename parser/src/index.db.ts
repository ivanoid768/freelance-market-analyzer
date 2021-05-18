import { createConnection } from "typeorm";

export async function connectDB() {
    try {
        return createConnection()
    } catch (e) {
        console.error(`DB connection error: ${e.message}`, e);
        throw e;
    }
}