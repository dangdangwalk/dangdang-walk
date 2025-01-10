import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

import { createLogger } from './console-logger';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private logger: winston.Logger;

    constructor() {
        this.logger = createLogger();
    }

    onModuleDestroy() {
        this.logger.close();
    }

    log(message: string, meta?: any) {
        this.logger.info(message, meta);
    }

    error(message: string, meta: any) {
        this.logger.error(message, meta);
    }

    warn(message: string, meta?: any) {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: any) {
        this.logger.debug(message, meta);
    }
}
