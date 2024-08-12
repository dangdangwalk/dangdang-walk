import { EntityManager, Repository } from 'typeorm';
import { Users } from './users.entity';
import { AbstractRepository } from '../common/database/abstract.repository';
export declare class UsersRepository extends AbstractRepository<Users> {
    constructor(usersRepository: Repository<Users>, entityManager: EntityManager);
}
