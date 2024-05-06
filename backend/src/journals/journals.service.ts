import { Injectable } from '@nestjs/common';
import { DeleteResult, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateJournal } from './types/journal-types';
import { WalkJournals } from './walk-journals.entity';
import { WalkJournalsRepository } from './walk-journals.repository';

@Injectable()
export class JournalsService {
    constructor(private readonly walkJournalsRepository: WalkJournalsRepository) {}

    async create(entityData: CreateJournal) {
        const walkJournals = new WalkJournals(entityData);
        return this.walkJournalsRepository.create(walkJournals);
    }

    async find(where: FindOptionsWhere<WalkJournals>) {
        return this.walkJournalsRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<WalkJournals>): Promise<WalkJournals> {
        return await this.walkJournalsRepository.findOne(where);
    }

    async update(
        where: FindOptionsWhere<WalkJournals>,
        partialEntity: QueryDeepPartialEntity<WalkJournals>
    ): Promise<UpdateResult> {
        return this.walkJournalsRepository.update(where, partialEntity);
    }

    async delete(where: FindOptionsWhere<WalkJournals>): Promise<DeleteResult> {
        return this.walkJournalsRepository.delete(where);
    }

    async updateAndFindOne(
        where: FindOptionsWhere<WalkJournals>,
        partialEntity: QueryDeepPartialEntity<WalkJournals>
    ): Promise<WalkJournals | null> {
        return this.walkJournalsRepository.updateAndFindOne(where, partialEntity);
    }
}
