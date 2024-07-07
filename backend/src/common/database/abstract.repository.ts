import { ConflictException, NotFoundException } from '@nestjs/common';
import {
    DeleteResult,
    EntityManager,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    InsertResult,
    ObjectLiteral,
    Repository,
    UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends ObjectLiteral> {
    constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager,
    ) {}

    async create(entity: T): Promise<T> {
        return this.entityRepository.save(entity);
    }

    /**
     * 주어진 entity가 이미 존재하는지 확인하고, 존재하지 않으면 새로운 entity를 생성하는 비동기 함수입니다.
     *
     * @param entity database에 저장하려는 새로운 entity입니다.
     * @param attributes entity를 식별하는 데 사용할 column(또는 속성)의 이름 또는 이름의 배열입니다.
     * 여러 개의 column을 지정하면 해당하는 조건이 모두 일치해야 기존 entity로 간주됩니다.
     * @returns entity가 성공적으로 생성되면 생성된 entity가 반환됩니다.
     */
    async createIfNotExists(entity: T, attributes: keyof T | (keyof T)[]): Promise<T> {
        const attributeList = Array.isArray(attributes) ? attributes : [attributes];

        const where: Partial<T> = {};
        for (const attribute of attributeList) {
            where[attribute] = entity[attribute];
        }

        const existingEntity = await this.entityRepository.findOne({ where });

        if (existingEntity) {
            throw new ConflictException('createIfNotExists: 이미 존재하는 레코드입니다');
        }

        return this.create(entity);
    }

    async insert(entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]): Promise<InsertResult> {
        return this.entityRepository.insert(entity);
    }

    async findOneWithNoException(where: FindOptionsWhere<T>): Promise<T | null> {
        return this.entityRepository.findOne({ where });
    }

    async findOne(where: FindOneOptions<T>): Promise<T> {
        const entity = await this.entityRepository.findOne(where);

        if (!entity) {
            throw new NotFoundException('findOne: 존재하지 않는 레코드입니다');
        }

        return entity;
    }

    async find(where: FindManyOptions<T>): Promise<T[]> {
        const result = this.entityRepository.find(where);

        if (!result) {
            throw new NotFoundException('find: 존재하지 않는 레코드입니다');
        }

        return result;
    }

    async update(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
        const updateResult = await this.entityRepository.update(where, partialEntity);

        if (!updateResult.affected) {
            throw new NotFoundException('update: 존재하지 않는 레코드입니다');
        }

        return updateResult;
    }

    async delete(where: FindOptionsWhere<T>): Promise<DeleteResult> {
        const deleteResult = await this.entityRepository.delete(where);

        if (!deleteResult.affected) {
            throw new NotFoundException('delete: 존재하지 않는 레코드입니다');
        }

        return deleteResult;
    }

    async updateAndFindOne(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T> {
        const updateResult = await this.entityRepository.update(where, partialEntity);

        if (!updateResult.affected) {
            throw new NotFoundException('update: 존재하지 않는 레코드입니다');
        }
        const options: FindOneOptions = { where };

        return this.findOne(options);
    }
}
