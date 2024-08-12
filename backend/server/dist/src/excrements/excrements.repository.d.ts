import { EntityManager, Repository } from 'typeorm';
import { Excrements } from './excrements.entity';
import { AbstractRepository } from '../common/database/abstract.repository';
export declare class ExcrementsRepository extends AbstractRepository<Excrements> {
    constructor(excrementsRepository: Repository<Excrements>, entityManager: EntityManager);
}
