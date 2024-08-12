import { LoggerService } from '@nestjs/common';
export declare class WinstonLoggerService implements LoggerService {
    private readonly logger;
    constructor();
    log(message: string, meta?: any): void;
    error(message: string, meta: any): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}
