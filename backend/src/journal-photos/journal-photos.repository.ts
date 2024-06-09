import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { AbstractRepository } from '../common/database/abstract.repository';

import { JournalPhotos } from './journal-photos.entity';

@Injectable()
export class JournalPhotosRepository extends AbstractRepository<JournalPhotos> {
    constructor(
        @InjectRepository(JournalPhotos) journalPhotosRepository: Repository<JournalPhotos>,
        entityManager: EntityManager,
    ) {
        super(journalPhotosRepository, entityManager);
    }
}
