import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { UsersService } from '../../users/users.service';
import { isTypedArray } from '../../utils/validator.util';

@Injectable()
export class AuthDogsGuard implements CanActivate {
    constructor(
        private readonly usersService: UsersService,
        private readonly logger: WinstonLoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const dogIds: number[] = this.getDogIds(request);

        await this.checkDogOwnership(userId, dogIds);

        return true;
    }

    private getDogIds(request: any): number[] {
        const body = request.body.dogs || request.body;

        if (!isTypedArray(body, 'number')) {
            const error = new BadRequestException(
                'Invalid request body. The request body should be an array of dogIds as numbers.',
            );
            this.logger.error('Invalid request body. The request body should be an array of dogIds as numbers.', {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }

        return body;
    }

    private async checkDogOwnership(userId: number, dogIds: number[]): Promise<void> {
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
    }
}
