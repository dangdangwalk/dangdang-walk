import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { WalkJournals } from './walk-journals.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalkJournalsRepository extends AbstractRepository<WalkJournals> {
    constructor(
        @InjectRepository(WalkJournals)
        walkJournalRepository: Repository<WalkJournals>,
        entityManager: EntityManager
    ) {
        super(walkJournalRepository, entityManager);
    }
}
