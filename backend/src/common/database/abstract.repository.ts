import { DeleteResult, EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
    constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager
    ) {}

    async create(entity: T): Promise<T> {
        return this.entityManager.save(entity);
    }

    async delete(where: FindOptionsWhere<T>): Promise<DeleteResult> {
        const deleteResult = await this.entityRepository.delete(where);

        if (!deleteResult.affected) {
            throw new NotFoundException('Entity not found');
        }
        return deleteResult;
    }

    async findOne(where: FindOptionsWhere<T>): Promise<T> {
        const entity = await this.entityRepository.findOne({ where });
        if (!entity) {
            throw new NotFoundException();
        }
        return entity;
    }

    async find(where: FindOptionsWhere<T>) {
        return this.entityRepository.findBy(where);
    }

    async findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T | null> {
        const updateResult = await this.entityRepository.update(where, partialEntity);
        if (!updateResult.affected) {
            throw new NotFoundException('Entity not found');
        }
        return this.entityRepository.findOne({ where });
    }
}
