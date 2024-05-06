import { Injectable, NotFoundException } from '@nestjs/common';
import { BreedService } from 'src/breed/breed.service';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { DailyWalkTimeService } from 'src/daily-walk-time/daily-walk-time.service';
import { DogWalkDayService } from 'src/dog-walk-day/dog-walk-day.service';
import { UsersService } from 'src/users/users.service';
import { FindOptionsWhere, In, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DogProfile } from './dogs.controller';
import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';
import { DogStatisticDto } from './dto/dog-statistic.dto';

@Injectable()
export class DogsService {
    constructor(
        private readonly dogsRepository: DogsRepository,
        private readonly usersService: UsersService,
        private readonly breedService: BreedService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly dailyWalkTimeService: DailyWalkTimeService,
        private readonly logger: WinstonLoggerService
    ) {}

    async find(where: FindOptionsWhere<Dogs>) {
        return this.dogsRepository.find(where);
    }
    async update(where: FindOptionsWhere<Dogs>, partialEntity: QueryDeepPartialEntity<Dogs>): Promise<UpdateResult> {
        return await this.dogsRepository.update(where, partialEntity);
    }

    async updateIsWalking(dogIds: number[], stateToUpdate: boolean) {
        const attrs = {
            isWalking: stateToUpdate,
        };
        await this.update({ id: In(dogIds) }, attrs);
        return dogIds;
    }

    private makeProfileList(dogs: Dogs[]): DogProfile[] {
        return dogs.map((cur) => {
            return {
                id: cur.id,
                name: cur.name,
                photoUrl: cur.photoUrl,
            };
        });
    }

    async getProfileList(where: FindOptionsWhere<Dogs>): Promise<DogProfile[]> {
        const ownDogList = await this.dogsRepository.find(where);
        return this.makeProfileList(ownDogList);
    }

    async getRelatedTableIdList(
        ownDogIds: number[],
        attributeName: 'walkDayId' | 'dailyWalkTimeId' | 'breedId'
    ): Promise<number[]> {
        const ownDogList = await this.dogsRepository.find({ id: In(ownDogIds) });
        return ownDogList.map((cur) => {
            return cur[attributeName];
        });
    }

    async getAvailableDogProfileList(ownDogIds: number[]): Promise<DogProfile[]> {
        const availableDogList = await this.dogsRepository.find({ id: In(ownDogIds), isWalking: false });
        const availableDogProfileList = this.makeProfileList(availableDogList);
        return availableDogProfileList;
    }

    private makeStatisticData(
        dogProfiles: DogProfile[],
        recommendedDailyWalkAmount: number[],
        dailyWalkAmount: number[],
        weeklyWalks: number[][]
    ): DogStatisticDto[] {
        const result: DogStatisticDto[] = [];
        for (let i = 0; i < dogProfiles.length; i++) {
            result.push({
                id: dogProfiles[i].id,
                name: dogProfiles[i].name,
                photoUrl: dogProfiles[i].photoUrl,
                recommendedDailyWalkAmount: recommendedDailyWalkAmount[i],
                dailyWalkAmount: dailyWalkAmount[i],
                weeklyWalks: weeklyWalks[i],
            });
        }
        return result;
    }

    async getDogsStatistics(userId: number): Promise<DogStatisticDto[]> {
        const ownDogIds = await this.usersService.getDogsList(userId);
        const dogWalkDayIds = await this.getRelatedTableIdList(ownDogIds, 'walkDayId');
        const dailyWalkTimeIds = await this.getRelatedTableIdList(ownDogIds, 'dailyWalkTimeId');
        const breedIds = await this.getRelatedTableIdList(ownDogIds, 'breedId');

        const dogProfiles = await this.getProfileList({ id: In(ownDogIds) });
        const recommendedDailyWalkAmount = await this.breedService.getActivityList(breedIds);
        const dailyWalkAmount = await this.dailyWalkTimeService.getWalkTimeList(dailyWalkTimeIds);
        const weeklyWalks = await this.dogWalkDayService.getWalkDayList(dogWalkDayIds);

        const length = ownDogIds.length;
        if (
            dogProfiles.length !== length ||
            recommendedDailyWalkAmount.length !== length ||
            dailyWalkAmount.length !== length ||
            weeklyWalks.length !== length
        ) {
            throw new NotFoundException();
        }

        return this.makeStatisticData(dogProfiles, recommendedDailyWalkAmount, dailyWalkAmount, weeklyWalks);
    }
}
