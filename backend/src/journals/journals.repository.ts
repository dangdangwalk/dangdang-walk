import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../common/database/abstract.repository';
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
