import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
export declare class OauthDataGuard implements CanActivate {
    private readonly logger;
    constructor(logger: WinstonLoggerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractOauthDataFromCookies;
}
