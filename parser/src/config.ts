import { env } from 'process';

class Config {
    readonly POSTGRES_DB_CONNECT_URI = env.POSTGRES_DB_CONNECT_URI;
    // readonly PASSWORD_HASH_SECRET = env.PASSWORD_HASH_SECRET || 'secret';
    readonly SOURCE_01_BASE_URL = env.SOURCE_01_BASE_URL;
    readonly RUN_MIGRATIONS = env.RUN_MIGRATIONS;

    readonly FLR_PAGE_COUNT = parseInt(env.FLR_PAGE_COUNT || '0') || 3;
}

export const config = new Config()