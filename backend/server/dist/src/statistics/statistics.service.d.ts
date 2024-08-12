import { Period } from './pipes/period-validation.pipe';
import { DogWalkingTotalResponse, DogsWeeklyWalkOverviewResponse } from './types/statistic.type';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { DogsService } from '../dogs/dogs.service';
import { JournalsService } from '../journals/journals.service';
import { TodayWalkTimeService } from '../today-walk-time/today-walk-time.service';
import { UsersService } from '../users/users.service';
export declare class StatisticsService {
    private readonly usersService;
    private readonly dogsService;
    private readonly dogWalkDayService;
    private readonly todayWalkTimeService;
    private readonly journalsService;
    private readonly logger;
    constructor(
        usersService: UsersService,
        dogsService: DogsService,
        dogWalkDayService: DogWalkDayService,
        todayWalkTimeService: TodayWalkTimeService,
        journalsService: JournalsService,
        logger: WinstonLoggerService,
    );
    getDogMonthlyWalkingTotal(userId: number, dogId: number, period: Period): Promise<DogWalkingTotalResponse>;
    getDogDailyWalkCountsByPeriod(
        userId: number,
        dogId: number,
        date: string,
        period: Period,
    ): Promise<{
        [date: string]: number;
    }>;
    getDogsWeeklyWalkingOverview(userId: number): Promise<DogsWeeklyWalkOverviewResponse[]>;
}
