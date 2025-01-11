import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Journals } from './journals.entity';

import { TypeORMRepository } from '../../shared/database/typeorm.repository';

@Injectable()
export class JournalsRepository extends TypeORMRepository<Journals> {
    constructor(
        @InjectRepository(Journals)
        walkJournalRepository: Repository<Journals>,
        entityManager: EntityManager,
    ) {
        super(walkJournalRepository, entityManager);
    }
}
