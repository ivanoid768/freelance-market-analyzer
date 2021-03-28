import { createConnection } from "typeorm";
import { config } from "./config";
import { User } from "./entity/User";

export async function connectDB() {
    try {
        return createConnection({
            type: "postgres",
            url: config.POSTGRES_DB_CONNECT_URI,
            entities: [
                User
            ],
            synchronize: true,
            logging: false,
        })
    } catch (e) {
        console.error(`DB connection error: ${e.message}`, e);
    }
}