import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

export function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} not found`);
    }
    return value;
};

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations"
};

export const config: Config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM")
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig
    },
    jwt: {
        defaultDuration: 3600,
        secret: envOrThrow("SECRET")
    }
}

export type APIConfig = {
    fileServerHits: number,
    port: number;
    platform: string
};

export type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

export type Config = {
    api: APIConfig;
    db: DBConfig;
    jwt: {
        defaultDuration: number,
        secret: string
    }
};









