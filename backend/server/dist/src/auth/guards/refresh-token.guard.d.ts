import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { AuthService } from '../auth.service';
export declare class RefreshTokenGuard implements CanActivate {
    private authService;
    private logger;
    constructor(authService: AuthService, logger: WinstonLoggerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractRefreshTokenFromCookie;
}
