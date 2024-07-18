import { Injectable } from '@nestjs/common';

import { ExcrementsCount } from 'src/journals/types/journal-detail.type';
import { EntityManager, InsertResult } from 'typeorm';

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';

@Injectable()
export class ExcrementsService {
    constructor(
        private readonly excrementsRepository: ExcrementsRepository,
        private readonly entityManager: EntityManager,
    ) {}

    async insert(
        entity: QueryDeepPartialEntity<Excrements> | QueryDeepPartialEntity<Excrements>[],
    ): Promise<InsertResult> {
        return await this.excrementsRepository.insert(entity);
    }

    async getExcrementsCount(journalId: number, dogIds: number[]): Promise<ExcrementsCount[]> {
        return await this.entityManager
            .createQueryBuilder(Excrements, 'excrements')
            .select(['dog_id AS dogId', 'type', 'COUNT(*) AS count'])
            .where('excrements.journal_id  = :journalId', { journalId })
            .andWhere('excrements.dog_id IN (:...dogIds)', { dogIds: dogIds })
            .groupBy('excrements.dog_id')
            .addGroupBy('excrements.type')
            .getRawMany();
    }

    makeCoordinate(lat: number, lng: number): string {
        return `POINT(${lat.toString()} ${lng.toString()})`;
    }
}
