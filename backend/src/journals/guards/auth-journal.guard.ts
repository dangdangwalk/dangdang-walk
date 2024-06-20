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

        await this.checkJournalOwnership(userId, journalId);

        return true;
    }

    private async checkJournalOwnership(userId: number, journalId: number): Promise<void> {
        const [owned] = await this.journalsService.checkJournalOwnership(userId, journalId);

        if (!owned) {
            const error = new ForbiddenException(
                `유저 ${userId}은/는 산책일지 ${journalId}에 대한 접근 권한이 없습니다`,
            );
            this.logger.error(`유저 ${userId}은/는 산책일지 ${journalId}에 대한 접근 권한이 없습니다`, {
                trace: error.stack ?? '스택 없음',
            });
            throw error;
        }
    }
}
