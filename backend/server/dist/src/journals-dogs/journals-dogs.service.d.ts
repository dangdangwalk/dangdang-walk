import { FindManyOptions, InsertResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { JournalsDogs } from './journals-dogs.entity';
import { JournalsDogsRepository } from './journals-dogs.repository';
export declare class JournalsDogsService {
    private readonly journalsDogsRepository;
    constructor(journalsDogsRepository: JournalsDogsRepository);
    private createIfNotExists;
    find(where: FindManyOptions<JournalsDogs>): Promise<JournalsDogs[]>;
    private makeDogData;
    insert(
        entity: QueryDeepPartialEntity<JournalsDogs> | QueryDeepPartialEntity<JournalsDogs>[],
    ): Promise<InsertResult>;
    createJournalDogs(journalId: number, dogIds: number[]): Promise<InsertResult>;
    getDogIdsByJournalId(journalId: number): Promise<number[]>;
}
