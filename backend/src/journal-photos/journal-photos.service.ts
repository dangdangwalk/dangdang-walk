import { ConflictException, Injectable } from '@nestjs/common';
import { DeleteResult, FindManyOptions, FindOptionsWhere, InsertResult } from 'typeorm';

import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { JournalPhotos } from './journal-photos.entity';
import { JournalPhotosRepository } from './journal-photos.repository';

@Injectable()
export class JournalPhotosService {
    constructor(private readonly journalPhotosRepository: JournalPhotosRepository) {}

    private async createIfNotExists(
        data: Partial<JournalPhotos>,
        keys: (keyof JournalPhotos)[],
    ): Promise<JournalPhotos> {
        const newEntity = new JournalPhotos(data);
        return this.journalPhotosRepository.createIfNotExists(newEntity, keys);
    }

    async find(where: FindManyOptions<JournalPhotos>): Promise<JournalPhotos[]> {
        return await this.journalPhotosRepository.find(where);
    }

    async delete(where: FindOptionsWhere<JournalPhotos>): Promise<DeleteResult> {
        return await this.journalPhotosRepository.delete(where);
    }

    async insert(
        entity: QueryPartialEntity<JournalPhotos> | QueryPartialEntity<JournalPhotos>[],
    ): Promise<InsertResult> {
        return await this.journalPhotosRepository.insert(entity);
    }

    async findDuplicate(journalId: number, photoUrls: string[]): Promise<boolean> {
        const toCompare = await this.journalPhotosRepository.find({
            where: { journalId },
            select: ['photoUrl'],
        });

        if (!toCompare.length) {
            return false;
        }

        const photoUrlSet = new Set(photoUrls);
        const result = toCompare.filter((curCompare) => photoUrlSet.has(curCompare.photoUrl));

        if (!result.length) {
            return false;
        }
        return true;
    }

    async createNewPhotoUrls(journalId: number, photoUrls: string[]) {
        if (await this.findDuplicate(journalId, photoUrls)) {
            throw new ConflictException('이미 존재하는 레코드입니다');
        }
        await this.insert(photoUrls.map((cur) => ({ journalId, photoUrl: cur })));
    }

    makePhotoUrls(photoUrlsRaw: Partial<JournalPhotos[]>): string[] {
        return photoUrlsRaw.map((cur) => {
            cur = cur as JournalPhotos;
            return cur.photoUrl;
        });
    }

    async getPhotoUrlsByJournalId(journalId: number): Promise<string[]> {
        const photoUrlsRaw: Partial<JournalPhotos[]> = await this.journalPhotosRepository.find({
            where: { journalId },
            select: ['photoUrl'],
        });
        return this.makePhotoUrls(photoUrlsRaw);
    }
}
