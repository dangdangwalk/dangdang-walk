import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { UsersService } from '../../users/users.service';
export declare class AuthDogGuard implements CanActivate {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService, logger: WinstonLoggerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getDogId;
    private checkDogOwnership;
    private isInt;
}
