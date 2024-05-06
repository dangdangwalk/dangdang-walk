import { NotFoundException } from '@nestjs/common';
import { DeleteResult, EntityManager, FindOptionsWhere, ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends ObjectLiteral> {
    constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager
    ) {}

    async create(entity: T): Promise<T> {
        return this.entityManager.save(entity);
    }

    async findOne(where: FindOptionsWhere<T>): Promise<T> {
        const entity = await this.entityRepository.findOne({ where });
        if (!entity) {
            throw new NotFoundException('Entity not found');
        }
        return entity;
    }

    async find(where: FindOptionsWhere<T>) {
        return this.entityRepository.findBy(where);
    }

    async update(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
        const updateResult = await this.entityRepository.update(where, partialEntity);
        if (!updateResult.affected) {
            throw new NotFoundException('Entity not found');
        }
        return updateResult;
    }

    async delete(where: FindOptionsWhere<T>): Promise<DeleteResult> {
        const deleteResult = await this.entityRepository.delete(where);

        if (!deleteResult.affected) {
            throw new NotFoundException('Entity not found');
        }
        return deleteResult;
    }

    async updateAndFindOne(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T | null> {
        const updateResult = await this.entityRepository.update(where, partialEntity);
        if (!updateResult.affected) {
            throw new NotFoundException('Entity not found');
        }
        return this.entityRepository.findOne({ where });
    }
}
