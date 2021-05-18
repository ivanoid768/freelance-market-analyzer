import { config } from './src/config';

export default {
    type: "postgres",
    url: config.POSTGRES_DB_CONNECT_URI,
    entities: [
        '../shared/src/entity/**/*.ts'
    ],
    synchronize: true,
    logging: false,
    migrationsRun: false,
 }