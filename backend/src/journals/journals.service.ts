import { Injectable } from '@nestjs/common';
import { WalkJournalsRepository } from './walk-jorunals.repository';
import { WalkJournals } from './walk-journals.entity';
import { DeleteResult, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateJournal } from './types/journal-types';

@Injectable()
export class JournalsService {
    constructor(private readonly walkJorunalsRepository: WalkJournalsRepository) {}

    async create(entityData: CreateJournal) {
        const walkJournals = new WalkJournals(entityData);
        return this.walkJorunalsRepository.create(walkJournals);
    }

    async find(where: FindOptionsWhere<WalkJournals>) {
        return this.walkJorunalsRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<WalkJournals>): Promise<WalkJournals> {
        return await this.walkJorunalsRepository.findOne(where);
    }

    async update(
        where: FindOptionsWhere<WalkJournals>,
        partialEntity: QueryDeepPartialEntity<WalkJournals>
    ): Promise<UpdateResult> {
        return this.walkJorunalsRepository.update(where, partialEntity);
    }

    async delete(where: FindOptionsWhere<WalkJournals>): Promise<DeleteResult> {
        return this.walkJorunalsRepository.delete(where);
    }

    async updateAndFindOne(
        where: FindOptionsWhere<WalkJournals>,
        partialEntity: QueryDeepPartialEntity<WalkJournals>
    ): Promise<WalkJournals | null> {
        return this.walkJorunalsRepository.updateAndFindOne(where, partialEntity);
    }
}
