import { env } from 'process'

class Config {
    readonly POSTGRES_DB_CONNECT_URI = env.POSTGRES_DB_CONNECT_URI;
    readonly RUN_MIGRATIONS = env.RUN_MIGRATIONS === '1' ? true : false;

    readonly PASSWORD_HASH_SECRET = parseInt(env.PASSWORD_SALT_ROUNDS || '0') || 10;
    readonly DEFAULT_ADMIN_PASSWORD = env.DEFAULT_ADMIN_PASSWORD || 'password123';
}

export const config = new Config()