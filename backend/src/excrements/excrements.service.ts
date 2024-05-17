import { Injectable } from '@nestjs/common';
import { DeleteResult, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';

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

    async find(where: FindOptionsWhere<Excrements>): Promise<Excrements[]> {
        return this.excrementsRepository.find({ where });
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
}
