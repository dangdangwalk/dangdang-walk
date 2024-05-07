import { Injectable } from '@nestjs/common';
import { DeleteResult, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Journals } from './journals.entity';
import { WalkJournalsRepository } from './journals.repository';
import { CreateJournal } from './types/journal-types';

@Injectable()
export class JournalsService {
    constructor(private readonly walkJournalsRepository: WalkJournalsRepository) {}

    async create(entityData: CreateJournal) {
        const walkJournals = new Journals(entityData);
        return this.walkJournalsRepository.create(walkJournals);
    }

    async find(where: FindOptionsWhere<Journals>) {
        return this.walkJournalsRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<Journals>): Promise<Journals> {
        return await this.walkJournalsRepository.findOne(where);
    }

    async update(
        where: FindOptionsWhere<Journals>,
        partialEntity: QueryDeepPartialEntity<Journals>
    ): Promise<UpdateResult> {
        return this.walkJournalsRepository.update(where, partialEntity);
    }

    async delete(where: FindOptionsWhere<Journals>): Promise<DeleteResult> {
        return this.walkJournalsRepository.delete(where);
    }

    async updateAndFindOne(
        where: FindOptionsWhere<Journals>,
        partialEntity: QueryDeepPartialEntity<Journals>
    ): Promise<Journals | null> {
        return this.walkJournalsRepository.updateAndFindOne(where, partialEntity);
    }
}
