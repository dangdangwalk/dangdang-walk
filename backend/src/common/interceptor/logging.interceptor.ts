import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { generateUuid } from 'src/utils/hash.utils';
import { WinstonLoggerService } from '../logger/winstonLogger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: WinstonLoggerService) {
        logger = new WinstonLoggerService(new Logger());
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const userInfo = request.user || '';
        const requestId = generateUuid();
        const { ip, method, path: url } = request;
        this.logger.log(`[REQUEST][${method} | ${url} | ${ip} | ${userInfo.userId || 'GUEST'}] ${requestId}`);

        const now = Date.now();
        return next.handle().pipe(
            tap((res) => {
                const response = context.switchToHttp().getResponse();
                const { statusCode } = response;

                this.logger.log(`[RESPONSE][${method}|${url}|${ip}|${statusCode}|${Date.now() - now}ms]${requestId}`);
                this.logger.debug(`Response Object : ${JSON.stringify(res)}`);
            })
        );
    }
}
