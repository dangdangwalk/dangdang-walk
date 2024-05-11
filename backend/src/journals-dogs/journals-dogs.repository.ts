import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../common/database/abstract.repository';
import { JournalsDogs } from './journals-dogs.entity';

@Injectable()
export class JournalsDogsRepository extends AbstractRepository<JournalsDogs> {
    constructor(
        @InjectRepository(JournalsDogs)
        journalsDogsRepository: Repository<JournalsDogs>,
        entityManager: EntityManager
    ) {
        super(journalsDogsRepository, entityManager);
    }
}
