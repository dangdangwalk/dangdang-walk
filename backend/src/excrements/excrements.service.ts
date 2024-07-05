import { Injectable } from '@nestjs/common';

import { ExcrementsCount } from 'src/journals/types/journal-detail.type';
import { EntityManager } from 'typeorm';

import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { Excrement } from './types/excrement.type';

import { Location } from '../journals/dtos/create-journal.dto';

@Injectable()
export class ExcrementsService {
    constructor(
        private readonly excrementsRepository: ExcrementsRepository,
        private readonly entityManager: EntityManager,
    ) {}

    async createNewExcrements(
        journalId: number,
        dogId: number,
        type: Excrement,
        location: Location,
    ): Promise<Excrements> {
        const coordinate = this.makeCoordinate(location.lat, location.lng);
        const data: Partial<Excrements> = { journalId, dogId, type, coordinate };
        const excrementsPromise = await this.createIfNotExists(data);

        return excrementsPromise;
    }

    async getExcrementsCount(journalId: number, dogIds: number[]): Promise<ExcrementsCount[]> {
        return this.entityManager
            .createQueryBuilder(Excrements, 'excrements')
            .select(['dog_id AS dogId', 'type', 'COUNT(*) AS count'])
            .where('excrements.journal_id  = :journalId', { journalId })
            .andWhere('excrements.dog_id IN (:...dogIds)', { dogIds: dogIds })
            .groupBy('excrements.dog_id')
            .addGroupBy('excrements.type')
            .getRawMany();
    }

    protected async createIfNotExists(data: Partial<Excrements>): Promise<Excrements> {
        const newEntity = new Excrements(data);

        return this.excrementsRepository.createIfNotExists(newEntity, ['journalId', 'dogId', 'type']);
    }

    protected makeCoordinate(lat: string, lng: string): string {
        return `POINT(${lat} ${lng})`;
    }
}
