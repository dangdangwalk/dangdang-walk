import { Injectable } from '@nestjs/common';

import { InsertResult } from 'typeorm';

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';

@Injectable()
export class ExcrementsService {
    constructor(private readonly excrementsRepository: ExcrementsRepository) {}

    async insert(
        entity: QueryDeepPartialEntity<Excrements> | QueryDeepPartialEntity<Excrements>[],
    ): Promise<InsertResult> {
        return await this.excrementsRepository.insert(entity);
    }

    makeCoordinate(lat: number, lng: number): string {
        return `POINT(${lat.toString()} ${lng.toString()})`;
    }
}
