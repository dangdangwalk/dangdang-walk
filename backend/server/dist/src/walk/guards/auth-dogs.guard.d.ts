import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { UsersService } from '../../users/users.service';
export declare class AuthDogsGuard implements CanActivate {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService, logger: WinstonLoggerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getDogIds;
    private checkDogOwnership;
}
