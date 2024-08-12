import { EntityManager, Repository } from 'typeorm';
import { Journals } from './journals.entity';
import { AbstractRepository } from '../common/database/abstract.repository';
export declare class JournalsRepository extends AbstractRepository<Journals> {
    constructor(walkJournalRepository: Repository<Journals>, entityManager: EntityManager);
}
