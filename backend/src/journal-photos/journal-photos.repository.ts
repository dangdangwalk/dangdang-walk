import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { JournalPhotos } from './journal-photos.entity';

import { AbstractRepository } from '../common/database/abstract.repository';

@Injectable()
export class JournalPhotosRepository extends AbstractRepository<JournalPhotos> {
    constructor(
        @InjectRepository(JournalPhotos) journalPhotosRepository: Repository<JournalPhotos>,
        entityManager: EntityManager,
    ) {
        super(journalPhotosRepository, entityManager);
    }
}
