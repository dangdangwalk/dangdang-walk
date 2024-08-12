import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WinstonLoggerService } from '../logger/winstonLogger.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly logger;
    constructor(logger: WinstonLoggerService);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>;
}
