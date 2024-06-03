import { Injectable } from '@nestjs/common';
import { Location } from 'src/journals/dtos/create-journal.dto';
import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { Excrement } from './types/excrement.type';

@Injectable()
export class ExcrementsService {
    constructor(private readonly excrementsRepository: ExcrementsRepository) {}

    private async createIfNotExists(data: Partial<Excrements>) {
        const newEntity = new Excrements(data);

        return this.excrementsRepository.createIfNotExists(newEntity, [
            'journalId' as keyof Excrements,
            'dogId' as keyof Excrements,
            'type' as keyof Excrements,
        ]);
    }

    private makeCoordinate(lat: string, lag: string): string {
        return `POINT(${lat} ${lag})`;
    }

    async createNewExcrements(
        journalId: number,
        dogId: number,
        type: Excrement,
        location: Location
    ): Promise<Excrements> {
        const coordinate = this.makeCoordinate(location.lat, location.lng);
        const data: Partial<Excrements> = { journalId, dogId, type, coordinate };

        return this.createIfNotExists(data);
    }

    async getExcrementsCnt(journalId: number, dogId: number, type: Excrement): Promise<number> {
        const excrements = await this.excrementsRepository.find({ where: { journalId, dogId, type } });

        return excrements.length;
    }
}
