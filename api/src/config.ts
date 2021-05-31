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
    readonly RUN_CATEGORY_CRON = env.RUN_CATEGORY_CRON || '0 0 * * 0';
    readonly RUN_TASK_CRON = env.RUN_TASK_CRON || '0 * * * *';

    readonly MAILER_HOST = env.MAILER_HOST;
    readonly MAILER_PORT = parseInt(env.MAILER_PORT);
    readonly MAILER_SECURE = env.MAILER_SECURE === '1' ? true : false;;
    readonly MAILER_USER = env.MAILER_USER;
    readonly MAILER_PASSWORD = env.MAILER_PASSWORD;
    readonly MAILER_FROM = env.MAILER_FROM;
}

export const config = new Config()