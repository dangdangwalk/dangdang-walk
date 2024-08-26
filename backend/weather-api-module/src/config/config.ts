import * as path from 'path';

import * as dotenv from 'dotenv';

import { WinstonLoggerService } from '../logger/winston-logger';

interface Config {
    WEATHER_KEY: string;
    SERVER_PORT: string;
    REDIS_PORT: string;
    CORS_ORIGIN: string;
}

export async function loadConfig() {
    const logger = WinstonLoggerService.getInstance();
    const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
    const config: Config = {} as Config;

    dotenv.config({ path: envPath });

    config.WEATHER_KEY = process.env.WEATHER_KEY || '';
    config.SERVER_PORT = process.env.SERVER_PORT || '3335';
    config.REDIS_PORT = process.env.REDIS_PORT || '6379';
    config.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

    const missingVars = Object.entries(config)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missingVars.length) {
        const errorMsg = `필수 환경변수가 없습니다: ${missingVars.join(', ')}`;
        logger.error(errorMsg, null);
        throw new Error(errorMsg);
    }

    const loadedConfig = Object.entries(config);
    logger.info('=================== CONFIG LOADED ===================');
    for (const conf of loadedConfig) {
        const [key, value] = conf;
        logger.info(`${key}: ${value}`);
    }
    logger.info('=====================================================');
}
