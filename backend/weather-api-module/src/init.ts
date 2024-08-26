import { loadConfig } from './config/config';
import { getServerInstance } from './http/http-server';
import { WinstonLoggerService } from './logger/winston-logger';
import { Scheduler } from './scheduler/scheduler';

async function init() {
    const logger = WinstonLoggerService.getInstance();
    try {
        logger.info('config를 로드합니다');
        await loadConfig();
        logger.info('config가 성공적으로 로드되었습니다');

        logger.info('Server를 실행합니다');
        const server = await getServerInstance();
        await server.initServer();
        logger.info('Server가 성공적으로 실행되었습니다');

        logger.info('Scheduler를 실행합니다');
        const scheduler = await Scheduler.getInstance();
        await scheduler.initializeScheduler();
        logger.info('Scheduler가 성공적으로 실행되었습니다');
    } catch (error) {
        console.error(`초기화 중 오류 발생. 프로세스를 종료합니다. Error:  ${error.message}`, error.stack);
        process.exit(1);
    }
}

init();
