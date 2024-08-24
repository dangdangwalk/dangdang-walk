import { loadConfig } from './config/config';
import { getServerInstance } from './http/http-server';
import { initializeScheduler } from './scheduler/scheduler';

async function init() {
    try {
        await loadConfig();

        const server = await getServerInstance();

        await server.initServer();

        initializeScheduler();
    } catch (error) {
        console.error('초기화 중 오류 발생. 프로세스를 종료합니다. Error: ', error.message);
        process.exit(1);
    }
}

init();
