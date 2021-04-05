import { env } from 'process'

class Config {
    readonly POSTGRES_DB_CONNECT_URI = env.POSTGRES_DB_CONNECT_URI;
    readonly RUN_MIGRATIONS = env.RUN_MIGRATIONS === '1' ? true : false;

    readonly PASSWORD_HASH_SECRET = env.PASSWORD_HASH_SECRET || 'secret';
}

export const config = new Config()