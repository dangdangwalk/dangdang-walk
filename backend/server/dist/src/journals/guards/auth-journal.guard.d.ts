import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { JournalsService } from '../journals.service';
export declare class AuthJournalGuard implements CanActivate {
    private readonly journalsService;
    private readonly logger;
    constructor(journalsService: JournalsService, logger: WinstonLoggerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private checkJournalOwnership;
}
