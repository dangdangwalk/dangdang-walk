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
export declare abstract class AbstractRepository<T extends ObjectLiteral> {
    private readonly entityRepository;
    private readonly entityManager;
    constructor(entityRepository: Repository<T>, entityManager: EntityManager);
    create(entity: T): Promise<T>;
    createIfNotExists(entity: T, attributes: keyof T | (keyof T)[]): Promise<T>;
    insert(entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]): Promise<InsertResult>;
    findOneWithNoException(where: FindOptionsWhere<T>): Promise<T | null>;
    findOne(where: FindOneOptions<T>): Promise<T>;
    find(where: FindManyOptions<T>): Promise<T[]>;
    update(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult>;
    delete(where: FindOptionsWhere<T>): Promise<DeleteResult>;
    updateAndFindOne(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T>;
}
