import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { JournalsService } from '../journals.service';

@Injectable()
export class AuthJournalGuard implements CanActivate {
    constructor(
        private readonly journalsService: JournalsService,
        private readonly logger: WinstonLoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const journalId = parseInt(request.params.id);

        const owned = await this.journalsService.checkJournalOwnership(userId, journalId);

        if (!owned) {
            const error = new ForbiddenException(`User ${userId} does not have access to journal ${journalId}`);
            this.logger.error(`User ${userId} does not have access to journal ${journalId}`, {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }

        return true;
    }
}
