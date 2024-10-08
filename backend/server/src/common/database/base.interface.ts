import { DeepPartial, FindManyOptions, ObjectLiteral } from 'typeorm';

export interface IBaseRepository<T> {
    create(entity: DeepPartial<T>): Promise<T>;

    createIfNotExists(entity: DeepPartial<T>, attributes: keyof T | (keyof T)[]): Promise<T>;

    insert(entity: Partial<T> | Partial<T>[]): Promise<ObjectLiteral>;

    findOneWithNoException(where: FindManyOptions<T>): Promise<T | null>;

    findOne(where: object): Promise<T>;

    find(where: object): Promise<T[]>;

    update(where: object, partialEntity: Partial<T>): Promise<ObjectLiteral>;

    delete(where: object): Promise<ObjectLiteral>;

    updateAndFindOne(where: object, partialEntity: Partial<T>): Promise<T>;
}
