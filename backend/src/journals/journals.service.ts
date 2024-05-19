import { ForbiddenException, Injectable } from '@nestjs/common';
import { DogsService } from 'src/dogs/dogs.service';
import { Excrements } from 'src/excrements/excrements.entity';
import { ExcrementsService } from 'src/excrements/excrements.service';
import { ExcrementsType } from 'src/excrements/types/excrements.enum';
import { JournalPhotos } from 'src/journal-photos/journal-photos.entity';
import { JournalPhotosService } from 'src/journal-photos/journal-photos.service';
import { JournalsDogs } from 'src/journals-dogs/journals-dogs.entity';
import { JournalsDogsService } from 'src/journals-dogs/journals-dogs.service';
import { getWeek } from 'src/utils/date.utils';
import { checkIfExistsInArr, makeSubObject } from 'src/utils/manipulate.util';
import { DeleteResult, EntityManager, FindOptionsWhere, In, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateJournalDto } from './dto/journal-update.dto';
import { CreateJournalDto, ExcrementsInfoForCreate, JournalInfoForCreate, Location } from './dto/journals-create.dto';
import { DogInfoForDetail, JournalDetailDto, JournalInfoForDetail, PhotoUrlDto } from './dto/journals-detail.dto';
import { Journals } from './journals.entity';
import { JournalsRepository } from './journals.repository';
import { CreateJournalData } from './types/journal-types';

@Injectable()
export class JournalsService {
    constructor(
        private readonly journalsRepository: JournalsRepository,
        private readonly journalsDogsService: JournalsDogsService,
        private readonly dogsService: DogsService,
        private readonly journalPhotosService: JournalPhotosService,
        private readonly excrementsService: ExcrementsService,
        private readonly entityManager: EntityManager
    ) {}

    async create(entityData: CreateJournalData): Promise<Journals> {
        const journals = new Journals(entityData);
        return this.journalsRepository.create(journals);
    }

    async find(where: FindOptionsWhere<Journals>) {
        return this.journalsRepository.find({ where });
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

    async delete(journalId: number): Promise<DeleteResult> {
        const where: FindOptionsWhere<Journals> = { id: journalId };
        return this.journalsRepository.delete(where);
    }

    async updateAndFindOne(
        where: FindOptionsWhere<Journals>,
        partialEntity: QueryDeepPartialEntity<Journals>
    ): Promise<Journals | null> {
        return this.journalsRepository.updateAndFindOne(where, partialEntity);
    }

    async getOwnJournals(userId: number): Promise<Journals[]> {
        return this.journalsRepository.find({ where: { id: userId } });
    }

    async getOwnJournalIds(userId: number): Promise<number[]> {
        const ownJournals = await this.journalsRepository.find({ where: { id: userId } });

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
        const journalInfo = makeSubObject(journalInfoRaw, JournalInfoForDetail.getKeysForJournalTable());

        journalInfo.photoUrls = await this.getJournalPhotos(journalId);

        return journalInfo;
    }

    async checkDogExistsInJournal(journalDogs: JournalsDogs[], dogId: number) {
        const journalDogIds = journalDogs.map((cur) => cur.dogId);

        if (!checkIfExistsInArr(journalDogIds, dogId)) {
            throw new ForbiddenException(`Dog ${dogId} is not included in current journal `);
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
        const companionsProfile = await this.dogsService.getDogsSummaryList({ id: In(companions) });

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
        } catch (error) {
            throw error;
        }
    }

    async checkJournalOwnership(userId: number, journalIds: number | number[]): Promise<boolean> {
        const myJournalIds = await this.getOwnJournalIds(userId);
        return checkIfExistsInArr(myJournalIds, journalIds);
    }

    async createNewJournal(userId: number, journalInfo: CreateJournalData) {
        if (!journalInfo.memo) {
            journalInfo.memo = '';
        }
        journalInfo.userId = userId;
        return await this.create(journalInfo);
    }

    async createNewJournalDogs(journalId: number, dogIds: number[]) {
        for (const curId of dogIds) {
            await this.journalsDogsService.createIfNotExists(journalId, curId);
        }
        return;
    }

    async createNewPhotoUrls(journalId: number, photoUrls: string[]) {
        const keys: (keyof JournalPhotos)[] = ['journalId', 'photoUrl'];
        const data: Partial<JournalPhotos> = {};

        data.journalId = journalId;

        for (const curUrl of photoUrls) {
            data.photoUrl = curUrl;
            await this.journalPhotosService.createIfNotExists(data, keys);
        }
    }

    private makeCoordinate(lat: string, lag: string): string {
        return `POINT(${lat} ${lag})`;
    }

    async createNewExcrements(
        journalId: number,
        dogId: number,
        type: ExcrementsType,
        location: Location
    ): Promise<Excrements> {
        const coordinate = this.makeCoordinate(location.lat, location.lng);
        const data: Partial<Excrements> = { journalId, dogId, type, coordinate };

        return this.excrementsService.createIfNotExists(data);
    }

    async excrementsLoop(journalId: number, excrements: ExcrementsInfoForCreate[]) {
        let dogId;
        for (const curExcrements of excrements) {
            dogId = curExcrements.dogId;

            for (const curFeces of curExcrements.fecesLocations) {
                await this.createNewExcrements(journalId, dogId, ExcrementsType.feces, curFeces);
            }

            for (const curUrine of curExcrements.urineLocations) {
                await this.createNewExcrements(journalId, dogId, ExcrementsType.urine, curUrine);
            }
        }
    }

    private makeJournalData(userId: number, createJournalData: CreateJournalDto) {
        const journalData: CreateJournalData = makeSubObject(
            createJournalData.journalInfo,
            JournalInfoForCreate.getKeysForJournalTable()
        );
        journalData.userId = userId;

        return journalData;
    }

    private checkPhotoUrlExist(photoUrls: string[] | undefined): string[] {
        if (!photoUrls) {
            return [];
        } else {
            return photoUrls;
        }
    }
    async createJournal(userId: number, createJournalData: CreateJournalDto) {
        const dogs = createJournalData.dogs;
        const journalData = this.makeJournalData(userId, createJournalData);

        const createJournalResult = await this.createNewJournal(userId, journalData);
        await this.createNewJournalDogs(createJournalResult.id, dogs);

        const photoUrls = this.checkPhotoUrlExist(createJournalData.journalInfo.photoUrls);
        if (photoUrls.length) {
            await this.createNewPhotoUrls(createJournalResult.id, photoUrls);
        }

        const excrements: ExcrementsInfoForCreate[] = createJournalData.excrements;
        if (excrements.length) {
            await this.excrementsLoop(createJournalResult.id, excrements);
        }
    }

    async updateJournal(journalId: number, updateJournalData: UpdateJournalDto) {
        if (updateJournalData.memo) {
            await this.updateAndFindOne({ id: journalId }, { memo: updateJournalData.memo });
        }
        if (updateJournalData.photoUrls) {
            await this.journalPhotosService.delete({ journalId });
            if (updateJournalData.photoUrls.length) {
                await this.createNewPhotoUrls(journalId, updateJournalData.photoUrls);
            }
        }
    }

    async deleteJournal(journalId: number) {
        await this.delete(journalId);
    }

    async aggregateJournalsByWeek(
        journals: Journals[],
        startDate: Date
    ): Promise<{
        journalCntAMonth: number[];
        distance: number[];
        durations: number[];
    }> {
        if (journals.length === 0) {
            return { journalCntAMonth: [], distance: [], durations: [] };
        }

        const lastDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        const totalWeeks = getWeek(lastDate);

        const journalCntAMonth = new Array(totalWeeks).fill(0);
        const distance = new Array(totalWeeks).fill(0);
        const durations = new Array(totalWeeks).fill(0);

        journals.forEach((journal) => {
            const weekIndex = getWeek(new Date(journal.startedAt)) - 1;
            journalCntAMonth[weekIndex]++;
            distance[weekIndex] += journal.distance;
            durations[weekIndex] += journal.duration;
        });

        return { journalCntAMonth, distance, durations };
    }

    async getDogStatistics(userId: number, dogId: number, date: string) {
        const startDate = new Date(date);
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const dogJournals = await this.entityManager
            .createQueryBuilder(Journals, 'journals')
            .innerJoin(JournalsDogs, 'journals_dogs', 'journals.id = journals_dogs.journal_id')
            .where('journals.user_id = :userId', { userId })
            .andWhere('journals_dogs.dog_id = :dogId', { dogId })
            .andWhere('journals.started_at >= :startDate', { startDate })
            .andWhere('journals.started_at < :endDate', { endDate })
            .getMany();

        return this.aggregateJournalsByWeek(dogJournals, startDate);
    }
}
