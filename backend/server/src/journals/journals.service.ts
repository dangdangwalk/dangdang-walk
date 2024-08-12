import { Injectable } from '@nestjs/common';

import { DeleteResult, EntityManager, FindOptionsWhere, In, InsertResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { Journals } from './journals.entity';
import { JournalsRepository } from './journals.repository';
import {
    ExcrementsInputForCreate,
    CreateJournalRequest,
    DogOutputForDetail,
    DogWalkJournalRaw,
    ExcrementCount,
    JournalDetailResponse,
    JournalDetailRaw,
    JournalOutputForDetail,
    JournalListResponse,
    UpdateJournalRequest,
    UpdateTodayWalkTimeOperation,
    UpdateJournalDatabaseInput,
    CreateJournalDatabaseInput,
    JournalInputForCreate,
} from './types/journal.types';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';

import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { DogsService } from '../dogs/dogs.service';
import { Excrements } from '../excrements/excrements.entity';
import { ExcrementsService } from '../excrements/excrements.service';
import { EXCREMENT, Excrement } from '../excrements/types/excrement.type';
import { JournalsDogs } from '../journals-dogs/journals-dogs.entity';
import { JournalsDogsService } from '../journals-dogs/journals-dogs.service';
import { S3Service } from '../s3/s3.service';
import { DogWalkingTotalResponse } from '../statistics/types/statistic.type';
import { TodayWalkTimeService } from '../today-walk-time/today-walk-time.service';
import { formatDate, getStartAndEndOfDay } from '../utils/date.util';
import { checkIfExistsInArr, makeSubObject, makeSubObjectsArray } from '../utils/manipulate.util';

@Injectable()
export class JournalsService {
    constructor(
        private readonly journalsRepository: JournalsRepository,
        private readonly journalsDogsService: JournalsDogsService,
        private readonly dogsService: DogsService,
        private readonly excrementsService: ExcrementsService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly todayWalkTimeService: TodayWalkTimeService,
        private readonly entityManager: EntityManager,
        private readonly s3Service: S3Service,
        private readonly logger: WinstonLoggerService,
    ) {}

    private async create(entityData: Partial<Journals>): Promise<Journals> {
        const journals = new Journals(entityData);
        return await this.journalsRepository.create(journals);
    }

    private async delete(journalId: number): Promise<DeleteResult> {
        const where: FindOptionsWhere<Journals> = { id: journalId };
        return await this.journalsRepository.delete(where);
    }

    private async update(journalId: number, updateData: Partial<Journals>) {
        this.journalsRepository.update({ id: journalId }, updateData);
    }

    private async getOwnJournalIds(userId: number): Promise<number[]> {
        const ownJournals = await this.journalsRepository.find({ where: { userId }, select: ['id'] });

        return ownJournals.map((cur) => cur.id);
    }

    async checkJournalOwnership(userId: number, journalIds: number | number[]): Promise<[boolean, number[]]> {
        const myJournalIds = await this.getOwnJournalIds(userId);
        return checkIfExistsInArr(myJournalIds, journalIds);
    }

    private makeJournalInfoForDetail(journalId: number, journalInfoRaw: JournalDetailRaw): JournalOutputForDetail {
        const journalInfo: JournalOutputForDetail = makeSubObject(
            journalInfoRaw,
            JournalOutputForDetail.getFieldForJournalTable(),
        );

        journalInfo.id = journalId;
        journalInfo.routes = journalInfoRaw.routes ? JSON.parse(journalInfoRaw.routes) : [];
        journalInfo.journalPhotos = journalInfoRaw.journalPhotos ? JSON.parse(journalInfoRaw.journalPhotos) : '';
        journalInfo.excrementCount = journalInfoRaw.excrementCount ? JSON.parse(journalInfoRaw.excrementCount) : {};

        return journalInfo;
    }

    async getDogsInfoForDetail(dogIds: number[]): Promise<DogOutputForDetail[]> {
        const dogInfoRaw = await this.dogsService.find({
            where: { id: In(dogIds) },
            select: DogOutputForDetail.getFieldForDogTable(),
        });
        return makeSubObjectsArray(dogInfoRaw, DogOutputForDetail.getFieldForDogTable());
    }

    async getJournalDetail(journalId: number): Promise<JournalDetailResponse> {
        const journalDogIds: number[] = await this.journalsDogsService.getDogIdsByJournalId(journalId);

        const [journalInfoRaw, dogInfo]: [JournalDetailRaw, DogOutputForDetail[]] = await Promise.all([
            await this.journalsRepository.findOne({
                where: { id: journalId },
                select: [...JournalOutputForDetail.getFieldForJournalTable()],
            }),
            this.getDogsInfoForDetail(journalDogIds),
        ]);
        const journalInfo: JournalOutputForDetail = this.makeJournalInfoForDetail(journalId, journalInfoRaw);

        return new JournalDetailResponse(journalInfo, dogInfo);
    }

    private makeJournalData(
        userId: number,
        journalInputForCreate: JournalInputForCreate,
        excrementsInputForCreate: ExcrementsInputForCreate[],
    ): CreateJournalDatabaseInput {
        const journalData: CreateJournalDatabaseInput = {
            ...makeSubObject(journalInputForCreate, CreateJournalDatabaseInput.getKeysForJournalRequest()),
            userId,
        };
        const excrementsCntArr: ExcrementCount[] = excrementsInputForCreate.map((cur) => ({
            dogId: cur.dogId,
            fecesCnt: cur.fecesLocations.length,
            urineCnt: cur.urineLocations.length,
        }));
        journalData.memo = journalInputForCreate.memo ? journalInputForCreate.memo : '';
        journalData.excrementCount = JSON.stringify(excrementsCntArr);
        journalData.journalPhotos = JSON.stringify(
            journalInputForCreate.journalPhotos ? journalInputForCreate.journalPhotos : [],
        );

        journalData.routes = JSON.stringify(journalInputForCreate.routes);
        return journalData;
    }

    private async updateDogWalkDay(dogIds: number[], operation: (current: number) => number) {
        const dogWalkDayIds = await this.dogsService.getRelatedTableIdList(dogIds, 'walkDayId');

        await this.dogWalkDayService.updateDailyWalkCount(dogWalkDayIds, operation);
    }

    private async updateTodayWalkTime(dogIds: number[], duration: number, operation: UpdateTodayWalkTimeOperation) {
        const todayWalkTimeIds = await this.dogsService.getRelatedTableIdList(dogIds, 'todayWalkTimeId');
        await this.todayWalkTimeService.updateDurations(todayWalkTimeIds, duration, operation);
    }

    async createExcrements(journalId: number, excrements: ExcrementsInputForCreate[]): Promise<InsertResult> {
        const excrementsEntity: Partial<Excrements>[] = [];

        for (const curExcrements of excrements) {
            const { dogId, fecesLocations, urineLocations } = curExcrements;

            const createExcrementEntity = (
                journalId: number,
                dogId: number,
                type: Excrement,
                coordinate: [number, number],
            ) => ({
                journalId,
                dogId,
                type,
                coordinate: this.excrementsService.makeCoordinate(coordinate[0], coordinate[1]),
            });

            excrementsEntity.push(
                ...fecesLocations.map((coordinate) =>
                    createExcrementEntity(journalId, dogId, EXCREMENT.Feces, coordinate),
                ),
                ...urineLocations.map((coordinate) =>
                    createExcrementEntity(journalId, dogId, EXCREMENT.Urine, coordinate),
                ),
            );
        }

        return await this.excrementsService.insert(excrementsEntity);
    }

    @Transactional()
    async createJournal(userId: number, createJournalRequest: CreateJournalRequest): Promise<void> {
        const dogIds = createJournalRequest.dogs;
        const journalDatabaseInput: CreateJournalDatabaseInput = this.makeJournalData(
            userId,
            createJournalRequest.journalInfo,
            createJournalRequest.excrements,
        );
        const createJournalResult = await this.create(journalDatabaseInput);

        await this.journalsDogsService.createJournalDogs(createJournalResult.id, dogIds);

        const addDogWalkDay = (current: number) => (current += 1);
        const addTodayWalkTime = (current: number, value: number) => current + value;
        await this.updateDogWalkDay(dogIds, addDogWalkDay);
        await this.updateTodayWalkTime(dogIds, createJournalRequest.journalInfo.duration, addTodayWalkTime);

        if (createJournalRequest.excrements && createJournalRequest.excrements.length) {
            await this.createExcrements(createJournalResult.id, createJournalRequest.excrements);
        }
    }

    @Transactional()
    async updateJournal(journalId: number, updateJournalRequest: UpdateJournalRequest): Promise<void> {
        const updateJournalDatabaseInput: UpdateJournalDatabaseInput = {
            memo: updateJournalRequest.memo ? updateJournalRequest.memo : '',
            journalPhotos: updateJournalRequest.journalPhotos
                ? JSON.stringify(updateJournalRequest.journalPhotos)
                : '[]',
        };

        await this.update(journalId, updateJournalDatabaseInput);
    }

    @Transactional()
    async deleteJournal(userId: number, journalId: number) {
        const dogIds: number[] = await this.journalsDogsService.getDogIdsByJournalId(journalId);
        const journalRaw = await this.journalsRepository.findOne({ where: { id: journalId } });
        const journalPhotos: string[] = JSON.parse(journalRaw.journalPhotos);

        const subtractTodayWalkTime = (current: number, value: number) => current - value;
        const subtractDogWalkDay = (current: number) => (current -= 1);
        await this.updateDogWalkDay(dogIds, subtractDogWalkDay);
        await this.updateTodayWalkTime(dogIds, journalRaw.duration, subtractTodayWalkTime);

        await this.s3Service.deleteObjects(userId, journalPhotos);
        await this.delete(journalId);
    }

    private async findUserDogJournalsByDate(
        userId: number,
        dogId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<DogWalkJournalRaw[]> {
        return await this.entityManager.query(
            `
        SELECT STRAIGHT_JOIN journals.distance, journals.duration, journals.started_at as startedAt 
        FROM journals 
        INNER JOIN journals_dogs ON journals.id = journals_dogs.journal_id
        WHERE journals.user_id = ?
          AND journals_dogs.dog_id = ?
          AND journals.started_at >= ?
          AND journals.started_at < ?
      `,
            [userId, dogId, startDate, endDate],
        );
    }

    private getTotal(journals: DogWalkJournalRaw[]): DogWalkingTotalResponse {
        const totals = journals.reduce(
            (acc, journal) => {
                acc.totalWalkCnt += 1;
                acc.totalDistance += journal.distance;
                acc.totalTime += journal.duration;
                return acc;
            },
            { totalWalkCnt: 0, totalDistance: 0, totalTime: 0 },
        );
        return totals;
    }

    async findJournalsAndGetTotal(
        userId: number,
        dogId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<DogWalkingTotalResponse> {
        const dogJournals = await this.findUserDogJournalsByDate(userId, dogId, startDate, endDate);
        return this.getTotal(dogJournals);
    }

    private aggregateJournalsByDate(
        journals: DogWalkJournalRaw[],
        startDate: Date,
        endDate: Date,
    ): { [date: string]: number } {
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
        const dogJournals = await this.findUserDogJournalsByDate(userId, dogId, startDate, endDate);
        return Promise.resolve(this.aggregateJournalsByDate(dogJournals, startDate, endDate));
    }

    private async getJournalIdsByDogIdAndDate(userId: number, dogId: number, date: string): Promise<number[]> {
        const startEndDate = getStartAndEndOfDay(new Date(date));

        const result = await this.entityManager
            .createQueryBuilder(Journals, 'journals')
            .select([
                'journals.id AS "journalId"',
                'journals.started_at AS "startedAt"',
                'distance',
                'calories',
                'duration',
                '(SELECT COUNT(*) FROM journals_dogs jd WHERE jd.dog_id = :dogId AND jd.journal_id <= journals.id ) AS "journalCnt"',
            ])
            .innerJoin(JournalsDogs, 'journals_dogs', 'journals.id = journals_dogs.journal_id')
            .where('journals_dogs.dog_id = :dogId', { dogId })
            .andWhere('journals.user_id = :userId', { userId })
            .andWhere('journals.started_at >= :startDate', { startDate: startEndDate.startDate })
            .andWhere('journals.started_at < :endDate', { endDate: startEndDate.endDate })
            .getRawMany();

        return result.map((cur) => ({
            ...cur,
            journalCnt: parseInt(cur.journalCnt),
        }));
    }

    async getJournalList(userId: number, dogId: number, date: string): Promise<JournalListResponse[]> {
        const journalListRaw = await this.getJournalIdsByDogIdAndDate(userId, dogId, date);
        if (!journalListRaw.length) {
            return [];
        }

        const journalListResponse: JournalListResponse[] = makeSubObjectsArray(
            journalListRaw,
            JournalListResponse.getKeysForJournalListRaw(),
        );

        return journalListResponse;
    }
}
