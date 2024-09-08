import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { In } from 'typeorm';

import { Period } from './pipes/period-validation.pipe';

import { DogWalkingTotalResponse, DogsWeeklyWalkOverviewResponse } from './types/statistic.type';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { CACHE_TTL, EVENTS } from '../const/cache-const';
import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { DogsService } from '../dogs/dogs.service';
import { JournalsService } from '../journals/journals.service';
import { TodayWalkTimeService } from '../today-walk-time/today-walk-time.service';
import { UsersService } from '../users/users.service';

import { getOneMonthAgo, getStartAndEndOfMonth, getStartAndEndOfWeek } from '../utils/date.util';
import { makeSubObject } from '../utils/manipulate.util';

@Injectable()
export class StatisticsService {
    constructor(
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly todayWalkTimeService: TodayWalkTimeService,
        private readonly journalsService: JournalsService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly logger: WinstonLoggerService,
    ) {}

    async getDogMonthlyWalkingTotal(userId: number, dogId: number, period: Period): Promise<DogWalkingTotalResponse> {
        let startDate: Date, endDate: Date;

        if (period === 'month') {
            ({ startDate, endDate } = getOneMonthAgo(new Date()));
        } else {
            throw new BadRequestException(`유효하지 않은 period: ${period}`);
        }

        return this.journalsService.findJournalsAndGetTotal(userId, dogId, startDate, endDate);
    }

    async getDogDailyWalkCountsByPeriod(
        userId: number,
        dogId: number,
        date: string,
        period: Period,
    ): Promise<{ [date: string]: number }> {
        let startDate: Date, endDate: Date;

        if (period === 'month') {
            ({ startDate, endDate } = getStartAndEndOfMonth(new Date(date)));
        } else if (period === 'week') {
            ({ startDate, endDate } = getStartAndEndOfWeek(new Date(date)));
        } else {
            throw new BadRequestException(`유효하지 않은 period: ${period}`);
        }

        return this.journalsService.findJournalsAndAggregateByDay(userId, dogId, startDate, endDate);
    }

    private async getDogsWeeklyWalkingOverviewData(userId: number): Promise<DogsWeeklyWalkOverviewResponse[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        const ownDogInfos = await this.dogsService.find({
            where: { id: In(ownDogIds) },
            select: ['id', 'name', 'profilePhotoUrl', 'breed', 'todayWalkTime', 'walkDay'],
            relations: {
                walkDay: true,
                todayWalkTime: true,
            },
        });
        return await Promise.all(
            ownDogInfos.map(async (ownDogInfo) => ({
                ...makeSubObject(ownDogInfo, ['id', 'name', 'profilePhotoUrl']),
                recommendedWalkAmount: ownDogInfo.breed.recommendedWalkAmount,
                todayWalkAmount: await this.todayWalkTimeService.updateIfStaleAndGetDuration(ownDogInfo.todayWalkTime),
                weeklyWalks: await this.dogWalkDayService.updateIfStaleAndGetWeeklyWalks(ownDogInfo.walkDay),
            })),
        );
    }

    async getDogsWeeklyWalkingOverview(userId: number): Promise<DogsWeeklyWalkOverviewResponse[]> {
        const cacheKey = this.generateCacheKey(userId);
        let overviewData = await this.cacheManager.get<DogsWeeklyWalkOverviewResponse[]>(cacheKey);

        if (!overviewData) {
            this.logger.log(`유저 ${userId}의 일주일 산책 통계 데이터에 대한 캐시 미스 발생, 데이터를 조회합니다`);
            overviewData = await this.getDogsWeeklyWalkingOverviewData(userId);
            await this.cacheManager.set(cacheKey, overviewData, CACHE_TTL);
        }
        return overviewData;
    }

    @OnEvent(EVENTS.DOG_CREATED)
    @OnEvent(EVENTS.DOG_DELETED)
    @OnEvent(EVENTS.DOG_UPDATED)
    @OnEvent(EVENTS.JOURNAL_CREATED)
    @OnEvent(EVENTS.JOURNAL_DELETED)
    async updateDogWalkingStatisticsCache(payload: { userId: number }) {
        const { userId } = payload;
        const cacheKey = this.generateCacheKey(userId);
        try {
            const overviewData = await this.getDogsWeeklyWalkingOverviewData(userId);

            await this.cacheManager.set(cacheKey, overviewData, CACHE_TTL);
            this.logger.log('statistics 캐시 데이터를 업데이트 했습니다.');
            this.logger.debug(JSON.stringify(overviewData));
        } catch (error) {
            this.logger.error(`캐시 업데이트 중 오류 발생: ${error.message}`, error.stack);
            await this.cacheManager.del(cacheKey);
            this.logger.log(`유저 ${payload.userId}의 캐시를 무효화했습니다.`);
        }
    }

    private generateCacheKey(userId: number) {
        return `statistics:${userId}`;
    }
}
