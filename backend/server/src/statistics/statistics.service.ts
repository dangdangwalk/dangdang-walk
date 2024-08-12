import { BadRequestException, Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { Period } from './pipes/period-validation.pipe';

import { DogWalkingTotalResponse, DogsWeeklyWalkOverviewResponse } from './types/statistic.type';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
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

    async getDogsWeeklyWalkingOverview(userId: number): Promise<DogsWeeklyWalkOverviewResponse[]> {
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
}
