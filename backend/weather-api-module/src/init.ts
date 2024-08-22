import { loadConfig } from './env';
import { getServerInstance } from './http/http-server';
import { initializeScheduler } from './scheduler/scheduler';

function init() {
    const server = getServerInstance();

    loadConfig();

    server.initServer();

    initializeScheduler();
}

init();
