import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { WinstonLoggerService } from '../logger/winstonLogger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: WinstonLoggerService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const requestId = request.requestId || 'N/A';
        const userTag = request.userTag || 'UNKNOWN';

        let status: number;
        let message: string;
        let cause: any;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseObj = exception.getResponse();
            message = typeof responseObj === 'string' ? responseObj : (responseObj as any).message || 'Unknown error';
            cause = exception.cause || null;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = (exception as Error)?.message || 'Internal server error';
        }

        const logLevel = status < 500 ? 'warn' : 'error';
        this.logger[logLevel](message, {
            type: 'EXCEPTION',
            method: request.method,
            path: request.url,
            ip: request.ip,
            status,
            userTag,
            requestId,
            trace: (exception as Error)?.stack,
            details: cause,
        });

        response.status(status).json({
            statusCode: status,
            message,
        });
    }
}
