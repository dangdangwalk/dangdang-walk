import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeORMRepository } from 'shared/database/typeorm.repository';
import { EntityManager, Repository } from 'typeorm';

import { JournalsDogs } from './journals-dogs.entity';

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
