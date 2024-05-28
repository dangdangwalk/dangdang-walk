import { Injectable, NotFoundException } from '@nestjs/common';
import { DogsService } from 'src/dogs/dogs.service';
import { DogSummary } from 'src/dogs/types/dog.type';
import { JournalsService } from 'src/journals/journals.service';
import { getOneMonthAgo, getStartAndEndOfMonth, getStartAndEndOfWeek } from 'src/utils/date.util';
import { In } from 'typeorm';
import { BreedService } from '../breed/breed.service';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { TodayWalkTimeService } from '../today-walk-time/today-walk-time.service';
import { UsersService } from '../users/users.service';
import { Period } from './pipes/period-validation.pipe';
import { DogStatistic } from './types/statistic.type';

@Injectable()
export class StatisticsService {
    constructor(
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService,
        private readonly breedService: BreedService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly todayWalkTimeService: TodayWalkTimeService,
        private readonly journalsService: JournalsService,
        private readonly logger: WinstonLoggerService
    ) {}

    private makeStatisticData(
        dogProfiles: DogSummary[],
        recommendedWalkAmount: number[],
        todayWalkAmount: number[],
        weeklyWalks: number[][]
    ): DogStatistic[] {
        const result: DogStatistic[] = [];
        for (let i = 0; i < dogProfiles.length; i++) {
            result.push({
                id: dogProfiles[i].id,
                name: dogProfiles[i].name,
                profilePhotoUrl: dogProfiles[i].profilePhotoUrl,
                recommendedWalkAmount: recommendedWalkAmount[i],
                todayWalkAmount: todayWalkAmount[i],
                weeklyWalks: weeklyWalks[i],
            });
        }
        return result;
    }

    async getDogStatistics(userId: number, dogId: number, period: Period) {
        let startDate: Date, endDate: Date;
        startDate = endDate = new Date();

        if (period === 'month') {
            startDate = getOneMonthAgo(new Date());
        }

        return this.journalsService.findJournalsAndGetTotal(userId, dogId, startDate, endDate);
    }

    async getDogWalkCnt(userId: number, dogId: number, date: string, period: Period) {
        let startDate: Date, endDate: Date;
        startDate = endDate = new Date();

        if (period === 'month') {
            ({ startDate, endDate } = getStartAndEndOfMonth(new Date(date)));
        } else if (period === 'week') {
            ({ startDate, endDate } = getStartAndEndOfWeek(new Date(date)));
        }

        return this.journalsService.findJournalsAndAggregateByDay(userId, dogId, startDate, endDate);
    }

    async getDogsStatistics(userId: number): Promise<DogStatistic[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        const dogWalkDayIds = await this.dogsService.getRelatedTableIdList(ownDogIds, 'walkDayId');
        const todayWalkTimeIds = await this.dogsService.getRelatedTableIdList(ownDogIds, 'todayWalkTimeId');
        const breedIds = await this.dogsService.getRelatedTableIdList(ownDogIds, 'breedId');

        const dogSummaries = await this.dogsService.getDogsSummaryList({ id: In(ownDogIds) });
        const recommendedWalkAmount = await this.breedService.getRecommendedWalkAmountList(breedIds);
        const todayWalkAmount = await this.todayWalkTimeService.getWalkTimeList(todayWalkTimeIds);
        const weeklyWalks = await this.dogWalkDayService.getWalkDayList(dogWalkDayIds);

        const length = ownDogIds.length;
        const mismatchedLengths = [
            dogSummaries.length !== length && `dogProfiles.length = ${dogSummaries.length}`,
            recommendedWalkAmount.length !== length && `recommendedWalkAmount.length = ${recommendedWalkAmount.length}`,
            todayWalkAmount.length !== length && `todayWalkAmount.length = ${todayWalkAmount.length}`,
            weeklyWalks.length !== length && `weeklyWalks.length = ${weeklyWalks.length}`,
        ].filter(Boolean);
        if (mismatchedLengths.length > 0) {
            const error = new NotFoundException(`Data missing or mismatched for dogId: ${ownDogIds}.`);
            this.logger.error(
                `Data missing or mismatched for dogId: ${ownDogIds}. Expected length: ${length}. Mismatched data: ${mismatchedLengths.join(', ')}`,
                error.stack ?? 'No stack'
            );
            throw error;
        }

        return this.makeStatisticData(dogSummaries, recommendedWalkAmount, todayWalkAmount, weeklyWalks);
    }
}
