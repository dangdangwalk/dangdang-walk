import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { EntityManager, Repository } from 'typeorm';
import { JournalPhotos } from './journal-photos.entity';

@Injectable()
export class JournalPhotosRepository extends AbstractRepository<JournalPhotos> {
    constructor(
        @InjectRepository(JournalPhotos) journalPhotosRepository: Repository<JournalPhotos>,
        entityManager: EntityManager
    ) {
        super(journalPhotosRepository, entityManager);
    }
}
