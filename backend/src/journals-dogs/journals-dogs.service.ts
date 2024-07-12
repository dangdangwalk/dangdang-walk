import { Injectable } from '@nestjs/common';
import { FindManyOptions, InsertResult } from 'typeorm';

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { JournalsDogs } from './journals-dogs.entity';
import { JournalsDogsRepository } from './journals-dogs.repository';

@Injectable()
export class JournalsDogsService {
    constructor(private readonly journalsDogsRepository: JournalsDogsRepository) {}

    private async createIfNotExists(journalId: number, dogId: number): Promise<JournalsDogs> {
        const newEntity = new JournalsDogs({ journalId, dogId });
        return await this.journalsDogsRepository.createIfNotExists(newEntity, ['journalId', 'dogId']);
    }

    async find(where: FindManyOptions<JournalsDogs>): Promise<JournalsDogs[]> {
        return await this.journalsDogsRepository.find(where);
    }

    private makeDogData(journalId: number, dogIds: number[]): Partial<JournalsDogs>[] {
        return dogIds.map((curId) => ({
            journalId: journalId,
            dogId: curId,
        }));
    }

    async insert(
        entity: QueryDeepPartialEntity<JournalsDogs> | QueryDeepPartialEntity<JournalsDogs>[],
    ): Promise<InsertResult> {
        return await this.journalsDogsRepository.insert(entity);
    }

    async createJournalDogs(journalId: number, dogIds: number[]) {
        const journalDogsData: Partial<JournalsDogs>[] = this.makeDogData(journalId, dogIds);
        return await this.insert(journalDogsData);
    }

    //TODO: map 안쓰게 select 사용
    async getDogIdsByJournalId(journalId: number): Promise<number[]> {
        const findResult = await this.journalsDogsRepository.find({ where: { journalId } });

        return findResult.map((cur) => cur.dogId);
    }
}
