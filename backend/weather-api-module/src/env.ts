import * as path from 'path';

import * as dotenv from 'dotenv';

import { getLogger } from './logger/logger-factory';

export function loadConfig() {
    const logger = getLogger();

    const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
    dotenv.config({ path: envPath });

    const SERVER_PORT = process.env.SERVER_PORT;
    const REDIS_PORT = process.env.REDIS_PORT;
    const CORS_ORIGIN = process.env.CORS_ORIGIN;

    if (!SERVER_PORT || !REDIS_PORT || !CORS_ORIGIN) {
        const errorMsg = 'CONFIG ERROR';
        logger.error('환경변수 로드에 실패했습니다', errorMsg);
        throw new Error(errorMsg);
    }
    logger.info('=================== CONFIG LOADED ===================');
    logger.info(`SERVER PORT: ${SERVER_PORT}`);
    logger.info(`REDIS_PORT : ${REDIS_PORT}`);
    logger.info(`CORS_ORIGIN: ${CORS_ORIGIN}`);
    logger.info('=====================================================');
}
