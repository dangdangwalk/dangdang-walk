import { EntityManager, Repository } from 'typeorm';
import { UsersDogs } from './users-dogs.entity';
import { AbstractRepository } from '../common/database/abstract.repository';
export declare class UsersDogsRepository extends AbstractRepository<UsersDogs> {
    constructor(usersDogsRepository: Repository<UsersDogs>, entityManager: EntityManager);
}
