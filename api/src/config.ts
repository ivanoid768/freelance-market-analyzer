import { env } from 'process'

class Config {
    readonly POSTGRES_DB_CONNECT_URI = env.POSTGRES_DB_CONNECT_URI;

    readonly REDIS_HOST = env.REDIS_HOST;
    readonly REDIS_PORT = parseInt(env.REDIS_PORT || '0');

    readonly RUN_MIGRATIONS = env.RUN_MIGRATIONS === '1' ? true : false;

    readonly PASSWORD_HASH_SECRET = parseInt(env.PASSWORD_SALT_ROUNDS || '0') || 10;
    readonly DEFAULT_ADMIN_PASSWORD = env.DEFAULT_ADMIN_PASSWORD || 'password123';

    readonly RUN_CATEGORY_JOBS = env.RUN_CATEGORY_JOBS === '1' ? true : false;
    readonly RUN_TASK_JOBS = env.RUN_TASK_JOBS === '1' ? true : false;
    readonly RUN_CATEGORY_CRON = env.RUN_CATEGORY_CRON || '* * * * *';
    readonly RUN_TASK_CRON = env.RUN_TASK_CRON || '* * * * *';
}

export const config = new Config()