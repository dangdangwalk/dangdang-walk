import { Injectable } from '@nestjs/common';
import { DeleteResult, FindManyOptions, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { JournalPhotos } from './journal-photos.entity';
import { JournalPhotosRepository } from './journal-photos.repository';

@Injectable()
export class JournalPhotosService {
    constructor(private readonly journalPhotosRepository: JournalPhotosRepository) {}

    async create(data: Partial<JournalPhotos>): Promise<JournalPhotos> {
        const newEntity = new JournalPhotos(data);
        return this.journalPhotosRepository.create(newEntity);
    }

    async createIfNotExists(data: Partial<JournalPhotos>, keys: (keyof JournalPhotos)[]): Promise<JournalPhotos> {
        const newEntity = new JournalPhotos(data);
        return this.journalPhotosRepository.createIfNotExists(newEntity, keys);
    }

    async findOne(where: FindOptionsWhere<JournalPhotos>): Promise<JournalPhotos> {
        return this.journalPhotosRepository.findOne(where);
    }

    async find(where: FindManyOptions<JournalPhotos>): Promise<JournalPhotos[]> {
        return this.journalPhotosRepository.find(where);
    }

    async update(
        where: FindOptionsWhere<JournalPhotos>,
        partialEntity: QueryDeepPartialEntity<JournalPhotos>
    ): Promise<UpdateResult> {
        return this.journalPhotosRepository.update(where, partialEntity);
    }

    async updateAndFindOne(
        where: FindOptionsWhere<JournalPhotos>,
        partialEntity: QueryDeepPartialEntity<JournalPhotos>
    ): Promise<JournalPhotos | null> {
        return this.journalPhotosRepository.updateAndFindOne(where, partialEntity);
    }

    async delete(where: FindOptionsWhere<JournalPhotos>): Promise<DeleteResult> {
        return this.journalPhotosRepository.delete(where);
    }

    async getPhotoUrlsByJournalId(journalId: number): Promise<string[]> {
        const findResult = await this.find({ where: { journalId } });
        return findResult.map((cur) => {
            return cur.photoUrl;
        });
    }
}
