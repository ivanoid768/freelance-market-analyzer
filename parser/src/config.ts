import { env } from 'process';

class Config {
    readonly POSTGRES_DB_CONNECT_URI = env.POSTGRES_DB_CONNECT_URI;
    // readonly PASSWORD_HASH_SECRET = env.PASSWORD_HASH_SECRET || 'secret';
    readonly SOURCE_01_BASE_URL = env.SOURCE_01_BASE_URL;
}

export const config = new Config()