import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
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
        const dogId = parseInt(request.params.id);

        const owned = await this.usersService.checkDogOwnership(userId, dogId);

        if (!owned) {
            const error = new ForbiddenException(`User ${userId} does not own the dog ${dogId}.`);
            this.logger.error(`User ${userId} does not own the dog ${dogId}.`, error.stack ?? 'No stack');
            throw error;
        }

        return true;
    }
}
