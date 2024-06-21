import { Injectable } from '@nestjs/common';

import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { Excrement } from './types/excrement.type';

import { Location } from '../journals/dtos/create-journal.dto';

@Injectable()
export class ExcrementsService {
    constructor(private readonly excrementsRepository: ExcrementsRepository) {}

    private async createIfNotExists(data: Partial<Excrements>) {
        const newEntity = new Excrements(data);

        return this.excrementsRepository.createIfNotExists(newEntity, ['journalId', 'dogId', 'type']);
    }

    private makeCoordinate(lat: string, lng: string): string {
        return `POINT(${lat} ${lng})`;
    }

    async createNewExcrements(
        journalId: number,
        dogId: number,
        type: Excrement,
        location: Location,
    ): Promise<Excrements> {
        const coordinate = this.makeCoordinate(location.lat, location.lng);
        const data: Partial<Excrements> = { journalId, dogId, type, coordinate };

        return this.createIfNotExists(data);
    }

    //TODO: typeorm의 count? 함수 찾아서 적용하기
    async getExcrementsCount(journalId: number, dogId: number, type: Excrement): Promise<number> {
        const excrements = await this.excrementsRepository.find({ where: { journalId, dogId, type } });

        return excrements.length;
    }
}
