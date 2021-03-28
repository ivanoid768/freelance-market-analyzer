import { env } from 'process'

class Config {
    readonly POSTGRES_DB_CONNECT_URI = env.POSTGRES_DB_CONNECT_URI;
    readonly RUN_MIGRATIONS = env.RUN_MIGRATIONS === '1' ? true : false;
}

export const config = new Config()