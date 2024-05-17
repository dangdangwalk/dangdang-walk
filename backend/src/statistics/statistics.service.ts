import { Injectable, NotFoundException } from '@nestjs/common';
import { DogProfile } from 'src/dogs/dogs.controller';
import { DogsService } from 'src/dogs/dogs.service';
import { DogStatisticDto } from 'src/dogs/dto/dog-statistic.dto';
import { JournalsService } from 'src/journals/journals.service';
import { In } from 'typeorm';
import { BreedService } from '../breed/breed.service';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DailyWalkTimeService } from '../daily-walk-time/daily-walk-time.service';
import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class StatisticsService {
    constructor(
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService,
        private readonly breedService: BreedService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly dailyWalkTimeService: DailyWalkTimeService,
        private readonly journalsService: JournalsService,
        private readonly logger: WinstonLoggerService
    ) {}

    private makeStatisticData(
        dogProfiles: DogProfile[],
        recommendedWalkAmount: number[],
        todayWalkAmount: number[],
        weeklyWalks: number[][]
    ): DogStatisticDto[] {
        const result: DogStatisticDto[] = [];
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

    async getDogStatistics(userId: number, dogId: number, date: string) {
        const dog = await this.dogsService.findOne({ id: dogId });
        this.journalsService.getDogMonthlyJournals(userId, dogId, date);

        return { recommendedWalkAmount: dog.breed.recommendedWalkAmount };
    }

    async getDogsStatistics(userId: number): Promise<DogStatisticDto[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        const dogWalkDayIds = await this.dogsService.getRelatedTableIdList(ownDogIds, 'walkDayId');
        const dailyWalkTimeIds = await this.dogsService.getRelatedTableIdList(ownDogIds, 'todayWalkTimeId');
        const breedIds = await this.dogsService.getRelatedTableIdList(ownDogIds, 'breedId');

        const dogProfiles = await this.dogsService.getProfileList({ id: In(ownDogIds) });
        const recommendedWalkAmount = await this.breedService.getRecommendedWalkAmountList(breedIds);
        const todayWalkAmount = await this.dailyWalkTimeService.getWalkTimeList(dailyWalkTimeIds);
        const weeklyWalks = await this.dogWalkDayService.getWalkDayList(dogWalkDayIds);

        const length = ownDogIds.length;
        const mismatchedLengths = [
            dogProfiles.length !== length && `dogProfiles.length = ${dogProfiles.length}`,
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

        return this.makeStatisticData(dogProfiles, recommendedWalkAmount, todayWalkAmount, weeklyWalks);
    }
}
