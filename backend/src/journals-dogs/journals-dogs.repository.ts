import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { JournalsDogs } from 'src/journals/journals-dogs.entity';
import { EntityManager, Repository } from 'typeorm';

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
