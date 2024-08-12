import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
export declare class CookieInterceptor implements NestInterceptor {
    private configService;
    private logger;
    constructor(configService: ConfigService, logger: WinstonLoggerService);
    private readonly isProduction;
    private readonly sessionCookieOptions;
    private readonly refreshCookieOptions;
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>>;
    private setAuthCookies;
    private setOauthCookies;
    private clearAuthCookies;
    private clearOauthCookies;
}
