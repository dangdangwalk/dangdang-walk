import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Journals } from './journals.entity';

import { AbstractRepository } from '../common/database/abstract.repository';

@Injectable()
export class JournalsRepository extends AbstractRepository<Journals> {
    constructor(
        @InjectRepository(Journals)
        walkJournalRepository: Repository<Journals>,
        entityManager: EntityManager,
    ) {
        super(walkJournalRepository, entityManager);
    }
}
