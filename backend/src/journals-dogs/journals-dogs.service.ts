import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { JournalsDogs } from './journals-dogs.entity';
import { JournalsDogsRepository } from './journals-dogs.repository';

@Injectable()
export class JournalsDogsService {
    constructor(private readonly journalsDogsRepository: JournalsDogsRepository) {}

    async create(journalId: number, dogId: number): Promise<JournalsDogs> {
        const newEntity = new JournalsDogs({ journalId, dogId });
        return await this.journalsDogsRepository.create(newEntity);
    }

    async createIfNotExists(journalId: number, dogId: number): Promise<JournalsDogs> {
        const newEntity = new JournalsDogs({ journalId, dogId });
        return await this.journalsDogsRepository.createIfNotExists(newEntity, ['journalId', 'dogId']);
    }

    async findOne(where: FindOptionsWhere<JournalsDogs>): Promise<JournalsDogs> {
        return this.journalsDogsRepository.findOne(where);
    }

    async find(where: FindManyOptions<JournalsDogs>): Promise<JournalsDogs[]> {
        return this.journalsDogsRepository.find(where);
    }

    async findAndCountBy(where: FindOptionsWhere<JournalsDogs>) {
        return this.journalsDogsRepository.findAndCountBy(where);
    }

    async getRecentJournalId(dogIds: number[]): Promise<(number | undefined)[]> {
        const result = dogIds.map(async (curDogId) => {
            const journal = await this.journalsDogsRepository.find({
                where: { dogId: curDogId },
                order: { journalId: 'DESC' },
                take: 1,
            });
            return journal.length ? journal[0].journalId : undefined;
        });
        return Promise.all(result);
    }
}
