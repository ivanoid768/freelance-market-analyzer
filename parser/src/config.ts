import { env } from 'process';

class Config {
    readonly POSTGRES_DB_CONNECT_URI = env.POSTGRES_DB_CONNECT_URI;
    // readonly PASSWORD_HASH_SECRET = env.PASSWORD_HASH_SECRET || 'secret';
    readonly SOURCE_01_BASE_URL = env.SOURCE_01_BASE_URL;
    readonly RUN_MIGRATIONS = env.RUN_MIGRATIONS;

    readonly FLR_PAGE_COUNT = parseInt(env.FLR_PAGE_COUNT || '0') || 3;

    readonly REDIS_HOST = env.REDIS_HOST;
    readonly REDIS_PORT = parseInt(env.REDIS_PORT || '0');

    readonly RUN_CATEGORY_WORKER = env.RUN_CATEGORY_WORKER === '1' ? true : false;
    readonly RUN_TASK_WORKER = env.RUN_TASK_WORKER === '1' ? true : false;
}

export const config = new Config()