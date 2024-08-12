import { CreateJournalDto } from './dtos/create-journal.dto';
import { UpdateJournalDto } from './dtos/update-journal.dto';
import { JournalsService } from './journals.service';
import { JournalListResponse } from './types/journal.types';
import { AccessTokenPayload } from '../auth/token/token.service';
export declare class JournalsController {
    private readonly journalsService;
    constructor(journalsService: JournalsService);
    getJournalList(dogId: number, date: string, user: AccessTokenPayload): Promise<JournalListResponse[]>;
    createJournal(user: AccessTokenPayload, body: CreateJournalDto): Promise<void>;
    getJournalDetail(journalId: number): Promise<import('./types/journal.types').JournalDetailResponse>;
    updateJournal(journalId: number, body: UpdateJournalDto): Promise<void>;
    deleteJournal(user: AccessTokenPayload, journalId: number): Promise<void>;
}
