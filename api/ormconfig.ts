import { config } from './src/config';

export default {
    type: "postgres",
    url: config.POSTGRES_DB_CONNECT_URI,
    entities: [
        'src/entity/**/*.ts',
    ],
    synchronize: true,
    logging: false,
    migrations: ['src/migration/**/*.ts'],
    migrationsRun: config.RUN_MIGRATIONS,
 }