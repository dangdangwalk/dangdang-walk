import { Period } from './pipes/period-validation.pipe';
import { StatisticsService } from './statistics.service';
import { AccessTokenPayload } from '../auth/token/token.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getDogMonthlyWalkingTotal(
        { userId }: AccessTokenPayload,
        dogId: number,
        period: Period,
    ): Promise<import('./types/statistic.type').DogWalkingTotalResponse>;
    getDogDailyWalkCountsByPeriod(
        { userId }: AccessTokenPayload,
        dogId: number,
        date: string,
        period: Period,
    ): Promise<{
        [date: string]: number;
    }>;
    getDogsWeeklyWalkingOverview({
        userId,
    }: AccessTokenPayload): Promise<import('./types/statistic.type').DogsWeeklyWalkOverviewResponse[]>;
}
