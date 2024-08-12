import { EntityManager, Repository } from 'typeorm';
import { JournalsDogs } from './journals-dogs.entity';
import { AbstractRepository } from '../common/database/abstract.repository';
export declare class JournalsDogsRepository extends AbstractRepository<JournalsDogs> {
    constructor(journalsDogsRepository: Repository<JournalsDogs>, entityManager: EntityManager);
}
