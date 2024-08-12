import { EntityManager, InsertResult } from 'typeorm';
import { JournalsRepository } from './journals.repository';
import {
    ExcrementsInputForCreate,
    CreateJournalRequest,
    DogOutputForDetail,
    JournalDetailResponse,
    JournalListResponse,
    UpdateJournalRequest,
} from './types/journal.types';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { DogsService } from '../dogs/dogs.service';
import { ExcrementsService } from '../excrements/excrements.service';
import { JournalsDogsService } from '../journals-dogs/journals-dogs.service';
import { S3Service } from '../s3/s3.service';
import { DogWalkingTotalResponse } from '../statistics/types/statistic.type';
import { TodayWalkTimeService } from '../today-walk-time/today-walk-time.service';
export declare class JournalsService {
    private readonly journalsRepository;
    private readonly journalsDogsService;
    private readonly dogsService;
    private readonly excrementsService;
    private readonly dogWalkDayService;
    private readonly todayWalkTimeService;
    private readonly entityManager;
    private readonly s3Service;
    private readonly logger;
    constructor(
        journalsRepository: JournalsRepository,
        journalsDogsService: JournalsDogsService,
        dogsService: DogsService,
        excrementsService: ExcrementsService,
        dogWalkDayService: DogWalkDayService,
        todayWalkTimeService: TodayWalkTimeService,
        entityManager: EntityManager,
        s3Service: S3Service,
        logger: WinstonLoggerService,
    );
    private create;
    private delete;
    private update;
    private getOwnJournalIds;
    checkJournalOwnership(userId: number, journalIds: number | number[]): Promise<[boolean, number[]]>;
    private makeJournalInfoForDetail;
    getDogsInfoForDetail(dogIds: number[]): Promise<DogOutputForDetail[]>;
    getJournalDetail(journalId: number): Promise<JournalDetailResponse>;
    private makeJournalData;
    private updateDogWalkDay;
    private updateTodayWalkTime;
    createExcrements(journalId: number, excrements: ExcrementsInputForCreate[]): Promise<InsertResult>;
    createJournal(userId: number, createJournalRequest: CreateJournalRequest): Promise<void>;
    updateJournal(journalId: number, updateJournalRequest: UpdateJournalRequest): Promise<void>;
    deleteJournal(userId: number, journalId: number): Promise<void>;
    private findUserDogJournalsByDate;
    private getTotal;
    findJournalsAndGetTotal(
        userId: number,
        dogId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<DogWalkingTotalResponse>;
    private aggregateJournalsByDate;
    findJournalsAndAggregateByDay(
        userId: number,
        dogId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<{
        [date: string]: number;
    }>;
    private getJournalIdsByDogIdAndDate;
    getJournalList(userId: number, dogId: number, date: string): Promise<JournalListResponse[]>;
}
