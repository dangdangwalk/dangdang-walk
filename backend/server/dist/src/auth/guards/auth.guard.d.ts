import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { AuthService } from '../auth.service';
export declare class AuthGuard implements CanActivate {
    private authService;
    private reflector;
    private logger;
    constructor(authService: AuthService, reflector: Reflector, logger: WinstonLoggerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private shouldSkipAuthGuard;
    private extractAccessTokenFromHeader;
}
