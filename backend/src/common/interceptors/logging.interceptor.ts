import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { Color, bold, color, italic } from '../../utils/ansi.util';
import { generateUuid } from '../../utils/hash.util';
import { WinstonLoggerService } from '../logger/winstonLogger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: WinstonLoggerService) {
        logger = new WinstonLoggerService();
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const userInfo = request.user || '';

        let user;
        if (userInfo.userId) {
            user = `UserID-${userInfo.userId}`;
        } else if (userInfo.oauthId) {
            user = `OAuthID-${userInfo.oauthId}`;
        } else {
            user = 'GUEST';
        }

        const requestId = generateUuid();
        const { ip, method, path: url } = request;

        if (url === '/metrics') {
            return next.handle().pipe();
        }

        this.logger.log(
            `${color('REQUEST', 'Cyan')}  [ ${bold(method)} | ${bold(url)} | ${ip} | ${italic(user)} ] ${color(requestId, 'Black')}`,
        );

        const startTime = Date.now();
        return next.handle().pipe(
            tap((res) => {
                const response = context.switchToHttp().getResponse();
                const { statusCode } = response;

                const endTime = Date.now();
                const responseTime = endTime - startTime;

                let responseTimeColor: Color = 'Yellow';
                if (responseTime > 1000) {
                    responseTimeColor = 'Red';
                }

                this.logger.log(
                    `${color('RESPONSE', 'Magenta')} [ ${bold(method)} | ${bold(url)} | ${ip} | ${statusCode} | ${color(`+${responseTime}ms`, responseTimeColor)} ] ${color(requestId, 'Black')}`,
                );

                this.logger.debug('Response body', typeof res === 'object' ? { ...res } : { res });
            }),
        );
    }
}
