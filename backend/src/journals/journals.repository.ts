import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { EntityManager, Repository } from 'typeorm';
import { Journals } from './journals.entity';

@Injectable()
export class WalkJournalsRepository extends AbstractRepository<Journals> {
    constructor(
        @InjectRepository(Journals)
        walkJournalRepository: Repository<Journals>,
        entityManager: EntityManager
    ) {
        super(walkJournalRepository, entityManager);
    }
}
