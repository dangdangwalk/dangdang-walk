import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthDogGuard implements CanActivate {
    constructor(
        private readonly usersService: UsersService,
        private readonly logger: WinstonLoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const dogId = this.getDogId(request);

        await this.checkDogOwnership(userId, dogId);

        return true;
    }

    private getDogId(request: any): number {
        const id = request.query.dogId || request.params.id;

        if (!this.isInt(id)) {
            const error = new BadRequestException('Invalid dogId.');
            this.logger.error('Invalid dogId.', {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }

        return parseInt(id);
    }

    private async checkDogOwnership(userId: number, dogId: number): Promise<void> {
        const [owned] = await this.usersService.checkDogOwnership(userId, dogId);

        if (!owned) {
            const error = new ForbiddenException(`User ${userId} does not own the dog ${dogId}.`);
            this.logger.error(`User ${userId} does not own the dog ${dogId}.`, { trace: error.stack ?? 'No stack' });
            throw error;
        }
    }

    private isInt(value: any): boolean {
        const regex = /^\d+$/;
        return regex.test(value);
    }
}
