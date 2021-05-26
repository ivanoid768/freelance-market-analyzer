import { ConnectionOptions } from "bullmq";
import { config } from "src/config";

export const queueConnection: ConnectionOptions = {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT
}