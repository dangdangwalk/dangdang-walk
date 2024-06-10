import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthDogsGuard implements CanActivate {
    constructor(
        private readonly usersService: UsersService,
        private readonly logger: WinstonLoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const dogIds: number[] = request.body;

        const [owned, notFoundDogIds] = await this.usersService.checkDogOwnership(userId, dogIds);

        if (!owned) {
            const error = new ForbiddenException(
                `User ${userId} does not own the following dog(s): ${notFoundDogIds.join(', ')}.`,
            );
            this.logger.error(`User ${userId} does not own the following dog(s): ${notFoundDogIds.join(', ')}.`, {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }

        return true;
    }
}
