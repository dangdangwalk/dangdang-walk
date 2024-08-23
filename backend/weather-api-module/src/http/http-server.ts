import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

import { getLogger } from '../logger/logger-factory';
import { WinstonLoggerService } from '../logger/winston-logger';
import { Controller, getControllerInstance } from '../weather/weather-controller';

export class HttpServer {
    public server;
    private logger;
    private controller;

    constructor(logger: WinstonLoggerService, controller: Controller) {
        this.logger = logger;
        this.server = http.createServer(this.handleRequest.bind(this));
        this.controller = controller;
    }

    private handleRequest(req: IncomingMessage, res: ServerResponse): void {
        res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN as string);
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'content-type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }
        this.controller.handleRequest(req, res);
    }

    initServer(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.listen(parseInt(process.env.SERVER_PORT as string));

            this.server.once('listening', () => {
                this.logger.info(`Server listening on ${process.env.SERVER_PORT}`);
                resolve();
            });

            this.server.once('error', (error) => {
                this.logger.error(`Failed to start server: ${error.message}`, error.stack);
                reject(error);
            });
        });
    }
}

export async function getServerInstance() {
    return new HttpServer(getLogger(), await getControllerInstance());
}
