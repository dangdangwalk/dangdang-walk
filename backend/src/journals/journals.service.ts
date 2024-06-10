import { Injectable } from '@nestjs/common';
import { DeleteResult, EntityManager, FindOptionsWhere, In } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Journals } from './journals.entity';

import { JournalsRepository } from './journals.repository';

import { CreateExcrementsInfo, CreateJournalData, CreateJournalInfo } from './types/create-journal-data.type';

import {
    DogInfoForDetail,
    ExcrementsInfoForDetail,
    JournalDetail,
    JournalInfoForDetail,
} from './types/journal-detail.type';

import { JournalInfoForList } from './types/journal-info.type';

import { UpdateJournalData } from './types/update-journal-data.type';

import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { DogsService } from '../dogs/dogs.service';
import { ExcrementsService } from '../excrements/excrements.service';
import { EXCREMENT } from '../excrements/types/excrement.type';
import { JournalPhotosService } from '../journal-photos/journal-photos.service';
import { JournalsDogs } from '../journals-dogs/journals-dogs.entity';
import { JournalsDogsService } from '../journals-dogs/journals-dogs.service';
import { S3Service } from '../s3/s3.service';
import { TodayWalkTimeService } from '../today-walk-time/today-walk-time.service';
import { formatDate, getStartAndEndOfDay } from '../utils/date.util';
import { checkIfExistsInArr, makeSubObject, makeSubObjectsArray } from '../utils/manipulate.util';

@Injectable()
export class JournalsService {
    constructor(
        private readonly journalsRepository: JournalsRepository,
        private readonly journalsDogsService: JournalsDogsService,
        private readonly dogsService: DogsService,
        private readonly journalPhotosService: JournalPhotosService,
        private readonly excrementsService: ExcrementsService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly todayWalkTimeService: TodayWalkTimeService,
        private readonly entityManager: EntityManager,
        private readonly s3Service: S3Service,
    ) {}

    private async create(entityData: Partial<Journals>): Promise<Journals> {
        const journals = new Journals(entityData);
        return this.journalsRepository.create(journals);
    }

    private async delete(journalId: number): Promise<DeleteResult> {
        const where: FindOptionsWhere<Journals> = { id: journalId };
        return this.journalsRepository.delete(where);
    }

    private async updateAndFindOne(
        where: FindOptionsWhere<Journals>,
        partialEntity: QueryDeepPartialEntity<Journals>,
    ): Promise<Journals | null> {
        return this.journalsRepository.updateAndFindOne(where, partialEntity);
    }

    private async getOwnJournalIds(userId: number): Promise<number[]> {
        const ownJournals = await this.journalsRepository.find({ where: { userId: userId } });

        return ownJournals.map((cur) => cur.id);
    }

    async checkJournalOwnership(userId: number, journalIds: number | number[]): Promise<[boolean, number[]]> {
        const myJournalIds = await this.getOwnJournalIds(userId);
        return checkIfExistsInArr(myJournalIds, journalIds);
    }

    async getJournalInfoForDetail(journalId: number): Promise<JournalInfoForDetail> {
        const journalInfoRaw = await this.journalsRepository.findOne({ id: journalId });
        const journalInfo = makeSubObject(journalInfoRaw, JournalInfoForDetail.getKeysForJournalTable());
        journalInfo.id = journalId;
        journalInfo.routes = JSON.parse(journalInfo.routes);
        journalInfo.photoUrls = await this.journalPhotosService.getPhotoUrlsByJournalId(journalId);

        return journalInfo;
    }

    async getExcrementsInfoForDetail(journalId: number, dogId: number): Promise<ExcrementsInfoForDetail | void> {
        const excrementsInfo = new ExcrementsInfoForDetail();

        excrementsInfo.dogId = dogId;
        const fecesCnt = await this.excrementsService.getExcrementsCnt(journalId, dogId, EXCREMENT.Feces);
        const urineCnt = await this.excrementsService.getExcrementsCnt(journalId, dogId, EXCREMENT.Urine);
        if (!fecesCnt && !urineCnt) {
            return;
        }
        fecesCnt ? (excrementsInfo.fecesCnt = fecesCnt) : fecesCnt;
        urineCnt ? (excrementsInfo.urineCnt = urineCnt) : urineCnt;

        return excrementsInfo;
    }

    async getDogsInfoForDetail(dogId: number): Promise<DogInfoForDetail> {
        const dogInfoRaw = await this.dogsService.findOne({ id: dogId });

        const dogInfo: DogInfoForDetail = makeSubObject(dogInfoRaw, DogInfoForDetail.getKeysForDogTable());

        return dogInfo;
    }

    async getJournalDetail(journalId: number): Promise<JournalDetail> {
        try {
            const journalInfo = await this.getJournalInfoForDetail(journalId);

            const journalDogIds = await this.journalsDogsService.getDogIdsByJournalId(journalId);
            const dogInfo: DogInfoForDetail[] = [];
            const excrementsInfo: ExcrementsInfoForDetail[] = [];
            for (const curDogId of journalDogIds) {
                dogInfo.push(await this.getDogsInfoForDetail(curDogId));
                const curExcrements = await this.getExcrementsInfoForDetail(journalId, curDogId);
                curExcrements ? excrementsInfo.push(curExcrements) : curExcrements;
            }

            return new JournalDetail(journalInfo, dogInfo, excrementsInfo);
        } catch (error) {
            throw error;
        }
    }
    async createNewJournal(userId: number, journalInfo: Partial<Journals>) {
        if (!journalInfo.memo) {
            journalInfo.memo = '';
        }
        journalInfo.userId = userId;
        return await this.create(journalInfo);
    }

    async excrementsLoop(journalId: number, excrements: CreateExcrementsInfo[]) {
        let dogId;
        for (const curExcrements of excrements) {
            dogId = curExcrements.dogId;

            for (const curFeces of curExcrements.fecesLocations) {
                await this.excrementsService.createNewExcrements(journalId, dogId, EXCREMENT.Feces, curFeces);
            }

            for (const curUrine of curExcrements.urineLocations) {
                await this.excrementsService.createNewExcrements(journalId, dogId, EXCREMENT.Urine, curUrine);
            }
        }
    }

    private makeJournalData(userId: number, createJournalInfo: CreateJournalInfo): Partial<Journals> {
        const journalData: Partial<Journals> = makeSubObject(
            createJournalInfo,
            CreateJournalInfo.getKeysForJournalTable(),
        );
        journalData.userId = userId;
        journalData.routes = JSON.stringify(journalData.routes);

        return journalData;
    }

    private async updateDogWalkDay(dogIds: number[], operation: (current: number) => number) {
        const dogWalkDayIds = await this.dogsService.getRelatedTableIdList(dogIds, 'walkDayId');
        await this.dogWalkDayService.updateValues(dogWalkDayIds, operation);
    }

    private async updateTodayWalkTime(
        dogIds: number[],
        duration: number,
        operation: (current: number, operand: number) => number,
    ) {
        const todayWalkTimeIds = await this.dogsService.getRelatedTableIdList(dogIds, 'todayWalkTimeId');
        this.todayWalkTimeService.updateDurations(todayWalkTimeIds, duration, operation);
    }

    private checkPhotoUrlExist(photoUrls: string[] | undefined): string[] {
        if (!photoUrls) {
            return [];
        } else {
            return photoUrls;
        }
    }

    //@Transactional()
    async createJournal(userId: number, createJournalData: CreateJournalData) {
        const dogIds = createJournalData.dogs;
        const journalData = this.makeJournalData(userId, createJournalData.journalInfo);
        const createJournalResult = await this.createNewJournal(userId, journalData);
        await this.journalsDogsService.createNewJournalDogs(createJournalResult.id, dogIds);

        const photoUrls = this.checkPhotoUrlExist(createJournalData.journalInfo.photoUrls);
        await this.journalPhotosService.createNewPhotoUrls(createJournalResult.id, photoUrls);

        if (createJournalData.excrements) {
            const excrements: CreateExcrementsInfo[] = createJournalData.excrements;
            if (excrements.length) {
                await this.excrementsLoop(createJournalResult.id, excrements);
            }
        }

        await this.updateDogWalkDay(dogIds, (current: number) => (current += 1));
        await this.updateTodayWalkTime(
            dogIds,
            createJournalData.journalInfo.duration,
            (current: number, value: number) => current + value,
        );
    }

    // @Transactional()
    async updateJournal(journalId: number, updateJournalData: UpdateJournalData) {
        if (updateJournalData.memo) {
            await this.updateAndFindOne({ id: journalId }, { memo: updateJournalData.memo });
        }
        if (updateJournalData.photoUrls) {
            const journalPhotos = await this.journalPhotosService.find({ where: { journalId } });
            if (journalPhotos.length) {
                await this.journalPhotosService.delete({ journalId });
            }
            if (updateJournalData.photoUrls.length) {
                await this.journalPhotosService.createNewPhotoUrls(journalId, updateJournalData.photoUrls);
            }
        }
    }

    async deleteJournal(userId: number, journalId: number) {
        const photoUrls: string[] = await this.journalPhotosService.getPhotoUrlsByJournalId(journalId);
        const dogIds: number[] = await this.journalsDogsService.getDogIdsByJournalId(journalId);
        const journalInfo = await this.journalsRepository.findOne({ id: journalId });

        await this.updateDogWalkDay(dogIds, (current: number) => (current -= 1));
        await this.updateTodayWalkTime(
            dogIds,
            journalInfo.duration,
            (current: number, value: number) => current - value,
        );
        await this.s3Service.deleteObjects(userId, photoUrls);
        await this.delete(journalId);
    }

    private async findJournals(userId: number, dogId: number, startDate: Date, endDate: Date): Promise<Journals[]> {
        return this.entityManager
            .createQueryBuilder(Journals, 'journals')
            .innerJoin(JournalsDogs, 'journals_dogs', 'journals.id = journals_dogs.journal_id')
            .where('journals.user_id = :userId', { userId })
            .andWhere('journals_dogs.dog_id = :dogId', { dogId })
            .andWhere('journals.started_at >= :startDate', { startDate })
            .andWhere('journals.started_at < :endDate', { endDate })
            .getMany();
    }

    private async getTotal(
        journals: Journals[],
    ): Promise<{ totalWalkCnt: number; totalDistance: number; totalTime: number }> {
        const totalDistance = journals.reduce((acc, journal) => acc + journal.distance, 0);
        const totalTime = journals.reduce((acc, journal) => acc + journal.duration, 0);
        return { totalWalkCnt: journals.length, totalDistance, totalTime };
    }

    async findJournalsAndGetTotal(
        userId: number,
        dogId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<{ [date: string]: number }> {
        const dogJournals = await this.findJournals(userId, dogId, startDate, endDate);
        return this.getTotal(dogJournals);
    }

    async aggregateJournalsByDay(
        journals: Journals[],
        startDate: Date,
        endDate: Date,
    ): Promise<{ [date: string]: number }> {
        const journalCntAMonth: { [date: string]: number } = {};

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateString = formatDate(currentDate);
            journalCntAMonth[dateString] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        journals.forEach((journal) => {
            const journalDate = new Date(journal.startedAt);
            const dateString = formatDate(journalDate);
            journalCntAMonth[dateString]++;
        });

        return journalCntAMonth;
    }

    async findJournalsAndAggregateByDay(
        userId: number,
        dogId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<{ [date: string]: number }> {
        const dogJournals = await this.findJournals(userId, dogId, startDate, endDate);
        return this.aggregateJournalsByDay(dogJournals, startDate, endDate);
    }

    private async getJournalIdsByDogIdAndDate(dogId: number, date: string): Promise<number[]> {
        const startEndDate = getStartAndEndOfDay(new Date(date));
        const result = await this.entityManager
            .createQueryBuilder(Journals, 'journals')
            .orderBy('journals_id', 'ASC')
            .innerJoin(JournalsDogs, 'journals_dogs', 'journals.id = journals_dogs.journal_id')
            .where('journals_dogs.dog_id = :dogId', { dogId })
            .andWhere('journals.started_at >= :startDate', { startDate: startEndDate.startDate })
            .andWhere('journals.started_at < :endDate', { endDate: startEndDate.endDate })
            .getRawMany();

        return result.map((cur) => cur.journals_id);
    }

    private putDogCntToJournalList(journalInfos: JournalInfoForList[], firstJournalCnt: number): JournalInfoForList[] {
        return journalInfos.map((cur) => {
            const newJournal: JournalInfoForList = {
                ...cur,
                journalCnt: firstJournalCnt++,
            };
            return newJournal;
        });
    }

    async getJournalList(dogId: number, date: string): Promise<JournalInfoForList[]> {
        const journalIds = await this.getJournalIdsByDogIdAndDate(dogId, date);
        if (!journalIds.length) {
            return [];
        }
        const journalInfosRaw = await this.journalsRepository.find({ where: { id: In(journalIds) } });
        const journalInfos = await makeSubObjectsArray(
            journalInfosRaw,
            JournalInfoForList.getAttributesForJournalTable(),
            JournalInfoForList.getKeysForJournalTable(),
        );
        const findResult = await this.journalsDogsService.find({ where: { dogId } });
        const journalCntForFirstRow = findResult.findIndex((jd) => jd.journalId === journalInfos[0].journalId);
        const result = this.putDogCntToJournalList(journalInfos, journalCntForFirstRow + 1);
        return result;
    }
}
