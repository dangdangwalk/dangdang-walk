import { EntityManager, Repository } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
    constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager
    ) {}

    async create(entity: T): Promise<T> {
        return this.entityManager.save(entity);
    }
}
