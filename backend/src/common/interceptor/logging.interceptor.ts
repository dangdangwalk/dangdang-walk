import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { generateUuid } from '../../utils/hash.utils';
import { WinstonLoggerService } from '../logger/winstonLogger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: WinstonLoggerService) {
        logger = new WinstonLoggerService();
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const userInfo = request.user || '';
        const requestId = generateUuid();
        const { ip, method, path: url } = request;

        if (url === '/metrics') {
            return next.handle().pipe();
        }

        this.logger.log(
            `[REQUEST][${method} | ${url} | ${ip} | ${userInfo.userId || userInfo.oauthId || 'GUEST'}] ${requestId}`
        );

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
