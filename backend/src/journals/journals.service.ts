import { ForbiddenException, Injectable } from '@nestjs/common';
import { DogsService } from 'src/dogs/dogs.service';
import { ExcrementsService } from 'src/excrements/excrements.service';
import { ExcrementsType } from 'src/excrements/types/excrements.enum';
import { JournalPhotos } from 'src/journal-photos/journal-photos.entity';
import { JournalPhotosService } from 'src/journal-photos/journal-photos.service';
import { JournalsDogs } from 'src/journals-dogs/journals-dogs.entity';
import { JournalsDogsService } from 'src/journals-dogs/journals-dogs.service';
import { checkIfExistsInArr, makeSubObject } from 'src/utils/manipulate.util';
import { DeleteResult, FindOptionsWhere, In, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DogInfoForDetail, JournalDetailDto, JournalInfoForDetail, PhotoUrlDto } from './dto/journals-detail.dto';
import { Journals } from './journals.entity';
import { JournalsRepository } from './journals.repository';
import { CreateJournal } from './types/journal-types';

@Injectable()
export class JournalsService {
    constructor(
        private readonly journalsRepository: JournalsRepository,
        private readonly journalsDogsService: JournalsDogsService,
        private readonly dogsService: DogsService,
        private readonly journalPhotosService: JournalPhotosService,
        private readonly excrementsService: ExcrementsService
    ) {}

    async create(entityData: CreateJournal) {
        const journals = new Journals(entityData);
        return this.journalsRepository.create(journals);
    }

    async find(where: FindOptionsWhere<Journals>) {
        return this.journalsRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<Journals>): Promise<Journals> {
        return await this.journalsRepository.findOne(where);
    }

    async update(
        where: FindOptionsWhere<Journals>,
        partialEntity: QueryDeepPartialEntity<Journals>
    ): Promise<UpdateResult> {
        return this.journalsRepository.update(where, partialEntity);
    }

    async delete(where: FindOptionsWhere<Journals>): Promise<DeleteResult> {
        return this.journalsRepository.delete(where);
    }

    async updateAndFindOne(
        where: FindOptionsWhere<Journals>,
        partialEntity: QueryDeepPartialEntity<Journals>
    ): Promise<Journals | null> {
        return this.journalsRepository.updateAndFindOne(where, partialEntity);
    }

    async getOwnJournals(userId: number): Promise<Journals[]> {
        return this.journalsRepository.find({ id: userId });
    }

    async getOwnJournalIds(userId: number): Promise<number[]> {
        const ownJournals = await this.journalsRepository.find({ id: userId });
        return ownJournals.map((cur) => cur.id);
    }

    async getJournalPhotos(journalId: number): Promise<string[]> {
        const photoUrlsRaw = await this.journalPhotosService.find({ journalId });
        const photoUrls = photoUrlsRaw.map((cur) => {
            return cur[PhotoUrlDto.getKey() as keyof JournalPhotos];
        });
        return photoUrls as string[];
    }

    async getJournalInfoForDetail(journalId: number): Promise<JournalInfoForDetail> {
        const journalInfoRaw = await this.findOne({ id: journalId });
        const keys = JournalInfoForDetail.getKeysForJournalTable();
        const journalInfo = makeSubObject(journalInfoRaw, keys);
        journalInfo.photoUrls = await this.getJournalPhotos(journalId);
        return journalInfo;
    }

    async checkDogExistsInJournal(journalDogs: JournalsDogs[], dogId: number) {
        const journalDogIds = journalDogs.map((cur) => cur.dogId);

        if (!checkIfExistsInArr(journalDogIds, dogId)) {
            throw new ForbiddenException('이 일지에 속하지 않은 강아지에 대한 요청');
        }
        return;
    }

    async getExcrementsCnt(journalId: number, dogId: number, type: ExcrementsType): Promise<number> {
        const excrements = await this.excrementsService.find({ journalId, dogId, type });

        return excrements.length;
    }

    async getDogInfoForDetail(journalId: number, dogId: number): Promise<DogInfoForDetail> {
        const dogInfoRaw = await this.dogsService.findOne({ id: dogId });
        const dogInfo = makeSubObject(dogInfoRaw, DogInfoForDetail.getKeysForDogTable());
        const fecesCnt = await this.getExcrementsCnt(journalId, dogId, ExcrementsType.feces);
        const urineCnt = await this.getExcrementsCnt(journalId, dogId, ExcrementsType.urine);
        dogInfo.fecesCnt = fecesCnt;
        dogInfo.urineCnt = urineCnt;
        return dogInfo;
    }

    async getCompanionsProfile(journalDogs: JournalsDogs[], dogId: number) {
        const companions = journalDogs.filter((cur) => cur.dogId !== dogId).map((cur) => cur.dogId);
        const companionsProfile = await this.dogsService.getProfileList({ id: In(companions) });
        return companionsProfile;
    }

    async getJournalDetail(journalId: number, dogId: number): Promise<JournalDetailDto> {
        try {
            const journalDogs = await this.journalsDogsService.find({ journalId });
            await this.checkDogExistsInJournal(journalDogs, dogId);

            const journalInfo = await this.getJournalInfoForDetail(journalId);
            const dogInfo = await this.getDogInfoForDetail(journalId, dogId);
            const companionsProfile = await this.getCompanionsProfile(journalDogs, dogId);

            return new JournalDetailDto(journalInfo, dogInfo, companionsProfile);
        } catch (e) {
            throw e;
        }
    }

    async checkJournalOwnership(userId: number, journalIds: number | number[]): Promise<boolean> {
        const myJournalIds = await this.getOwnJournalIds(userId);
        return checkIfExistsInArr(myJournalIds, journalIds);
    }
}
