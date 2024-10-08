import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { JournalsDogs } from './journals-dogs.entity';

import { TypeORMRepository } from '../common/database/typeorm.repository';

@Injectable()
export class JournalsDogsRepository extends TypeORMRepository<JournalsDogs> {
    constructor(
        @InjectRepository(JournalsDogs)
        journalsDogsRepository: Repository<JournalsDogs>,
        entityManager: EntityManager,
    ) {
        super(journalsDogsRepository, entityManager);
    }
}
