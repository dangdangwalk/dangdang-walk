import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { ExcrementsService } from './excrements.service';

@Injectable()
export class FakeExcrementsService extends ExcrementsService {
    constructor(excrementsRepository: ExcrementsRepository, entityManager: EntityManager) {
        super(excrementsRepository, entityManager);
    }

    async createIfNotExists(data: Partial<Excrements>): Promise<Excrements> {
        const excrement: Excrements[] = [];

        const expectedExcrement = new Excrements({
            id: excrement.length + 1,
            journalId: data.journalId,
            dogId: data.dogId,
            type: data.type,
            coordinate: data.coordinate,
        });

        excrement.push(expectedExcrement);

        return Promise.resolve(expectedExcrement);
    }

    makeCoordinate(lat: number, lng: number): string {
        return `POINT(${lat} ${lng})`;
    }
}
