import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
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
        return this.journalsDogsRepository.find(where);
    }

    async createNewJournalDogs(journalId: number, dogIds: number[]) {
        for (const curId of dogIds) {
            await this.createIfNotExists(journalId, curId);
        }
        return;
    }

    async getDogIdsByJournalId(journalId: number): Promise<number[]> {
        const findResult = await this.journalsDogsRepository.find({ where: { journalId } });
        return findResult.map((cur) => cur.dogId);
    }
}
