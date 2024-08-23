import * as path from 'path';

import * as dotenv from 'dotenv';

import { getLogger } from './logger/logger-factory';

export async function loadConfig() {
    const logger = getLogger();
    const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
    const result = dotenv.config({ path: envPath });

    if (result.error) {
        const errorMsg = `환경변수 로드에 실패했습니다 : ${result.error}`;
        logger.error(errorMsg, null);
        throw new Error(`환경변수 로드에 실패했습니다: ${result.error}`);
    }

    const SERVER_PORT = process.env.SERVER_PORT;
    const REDIS_PORT = process.env.REDIS_PORT;
    const CORS_ORIGIN = process.env.CORS_ORIGIN;

    if (!SERVER_PORT || !REDIS_PORT || !CORS_ORIGIN) {
        const errorMsg = '필수 환경변수가 없습니다';
        logger.error(errorMsg, null);
    }

    logger.info('=================== CONFIG LOADED ===================');
    logger.info(`SERVER PORT: ${SERVER_PORT}`);
    logger.info(`REDIS_PORT : ${REDIS_PORT}`);
    logger.info(`CORS_ORIGIN: ${CORS_ORIGIN}`);
    logger.info('=====================================================');
}
