import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { JournalsDogs } from './journals-dogs.entity';

import { AbstractRepository } from '../common/database/abstract.repository';

@Injectable()
export class JournalsDogsRepository extends AbstractRepository<JournalsDogs> {
    constructor(
        @InjectRepository(JournalsDogs)
        journalsDogsRepository: Repository<JournalsDogs>,
        entityManager: EntityManager,
    ) {
        super(journalsDogsRepository, entityManager);
    }
}
