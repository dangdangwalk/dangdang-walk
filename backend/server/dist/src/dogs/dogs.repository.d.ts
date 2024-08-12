import { EntityManager, Repository } from 'typeorm';
import { Dogs } from './dogs.entity';
import { AbstractRepository } from '../common/database/abstract.repository';
export declare class DogsRepository extends AbstractRepository<Dogs> {
    constructor(dogsRepository: Repository<Dogs>, entityManager: EntityManager);
}
