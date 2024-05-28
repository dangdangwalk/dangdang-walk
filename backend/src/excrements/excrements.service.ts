import { Injectable } from '@nestjs/common';
import { Location } from 'src/journals/dtos/journals-create.dto';
import { DeleteResult, FindManyOptions, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { ExcrementsType } from './types/excrements.enum';

@Injectable()
export class ExcrementsService {
    constructor(private readonly excrementsRepository: ExcrementsRepository) {}

    async create(data: Excrements) {
        const newEntity = new Excrements(data);

        return this.excrementsRepository.create(newEntity);
    }

    async createIfNotExists(data: Partial<Excrements>) {
        const newEntity = new Excrements(data);

        return this.excrementsRepository.createIfNotExists(newEntity, [
            'journalId' as keyof Excrements,
            'dogId' as keyof Excrements,
            'type' as keyof Excrements,
        ]);
    }

    async find(where: FindManyOptions<Excrements>): Promise<Excrements[]> {
        return this.excrementsRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<Excrements>): Promise<Excrements> {
        return this.excrementsRepository.findOne(where);
    }

    async findOneWithNoException(where: FindOptionsWhere<Excrements>): Promise<Excrements | null> {
        return this.excrementsRepository.findOneWithNoException(where);
    }

    async update(
        where: FindOptionsWhere<Excrements>,
        partialEntity: QueryDeepPartialEntity<Excrements>
    ): Promise<UpdateResult> {
        return this.excrementsRepository.update(where, partialEntity);
    }

    async updateAndFindOne(
        where: FindOptionsWhere<Excrements>,
        partialEntity: QueryDeepPartialEntity<Excrements>
    ): Promise<Excrements> {
        return this.excrementsRepository.updateAndFindOne(where, partialEntity);
    }

    async delete(where: FindOptionsWhere<Excrements>): Promise<DeleteResult> {
        return this.excrementsRepository.delete(where);
    }

    private makeCoordinate(lat: string, lag: string): string {
        return `POINT(${lat} ${lag})`;
    }

    async createNewExcrements(
        journalId: number,
        dogId: number,
        type: ExcrementsType,
        location: Location
    ): Promise<Excrements> {
        const coordinate = this.makeCoordinate(location.lat, location.lng);
        const data: Partial<Excrements> = { journalId, dogId, type, coordinate };

        return this.createIfNotExists(data);
    }

    async getExcrementsCnt(journalId: number, dogId: number, type: ExcrementsType): Promise<number> {
        const excrements = await this.find({ where: { journalId, dogId, type } });

        return excrements.length;
    }
}
