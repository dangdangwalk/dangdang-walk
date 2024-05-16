import { Injectable, NotFoundException } from '@nestjs/common';
import { makeSubObjectsArray } from 'src/utils/manipulate.util';
import { FindOptionsWhere, In, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BreedService } from '../breed/breed.service';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DailyWalkTime } from '../daily-walk-time/daily-walk-time.entity';
import { DailyWalkTimeService } from '../daily-walk-time/daily-walk-time.service';
import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';
import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { UsersDogsService } from '../users-dogs/users-dogs.service';
import { UsersService } from '../users/users.service';
import { DogProfile } from './dogs.controller';
import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';
import { DogStatisticDto } from './dto/dog-statistic.dto';
import { DogDto } from './dto/dog.dto';

@Injectable()
export class DogsService {
    constructor(
        private readonly dogsRepository: DogsRepository,
        private readonly usersDogsService: UsersDogsService,
        private readonly usersService: UsersService,
        private readonly breedService: BreedService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly dailyWalkTimeService: DailyWalkTimeService,
        private readonly logger: WinstonLoggerService
    ) {}

    async createDogToUser(userId: number, dogDto: DogDto) {
        try {
            const { breed: breedName, ...otherAttributes } = dogDto;

            const breed = await this.breedService.findOne({ koreanName: breedName });

            const newDog = new Dogs({
                breed,
                walkDay: new DogWalkDay(),
                dailyWalkTime: new DailyWalkTime(),
                ...otherAttributes,
            });

            const dog = await this.dogsRepository.create(newDog);

            return this.usersDogsService.create({ userId, dogId: dog.id });
        } catch (error) {
            this.logger.error(`Unknown breed.`, error.stack ?? 'No stack');
            throw error;
        }
    }

    async deleteDogFromUser(dogId: number) {
        const dog = await this.findOne({ id: dogId });

        await this.dogWalkDayService.delete({ id: dog.walkDayId });
        await this.dailyWalkTimeService.delete({ id: dog.dailyWalkTimeId });

        return dog;
    }

    async findOne(where: FindOptionsWhere<Dogs>) {
        return this.dogsRepository.findOne(where);
    }

    async update(where: FindOptionsWhere<Dogs>, partialEntity: QueryDeepPartialEntity<Dogs>): Promise<UpdateResult> {
        return await this.dogsRepository.update(where, partialEntity);
    }

    async updateDog(dogId: number, dogDto: DogDto) {
        const { breed: breedName, ...otherAttributes } = dogDto;

        const breed = await this.breedService.findOne({ koreanName: breedName });

        return this.update({ id: dogId }, { breed, ...otherAttributes });
    }

    async updateIsWalking(dogIds: number[], stateToUpdate: boolean) {
        const attrs = {
            isWalking: stateToUpdate,
        };

        await this.update({ id: In(dogIds) }, attrs);

        return dogIds;
    }

    private makeProfile(dogInfo: Dogs): DogProfile {
        return {
            id: dogInfo.id,
            name: dogInfo.name,
            profilePhotoUrl: dogInfo.profilePhotoUrl,
        };
    }

    private makeProfileList(dogs: Dogs[]): DogProfile[] {
        return makeSubObjectsArray(dogs, ['id', 'name', 'profilePhotoUrl']);
    }

    async getAvailableDogs(userId: number): Promise<DogProfile[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        return this.getProfileList({ id: In(ownDogIds), isWalking: false });
    }

    async getProfileList(where: FindOptionsWhere<Dogs>): Promise<DogProfile[]> {
        const dogInfos = await this.dogsRepository.find(where);
        return this.makeProfileList(dogInfos);
    }

    async getProfile(dogId: number): Promise<DogProfile> {
        const dogInfo = await this.dogsRepository.findOne({ id: dogId });
        return this.makeProfile(dogInfo);
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
        const dog = await this.findOne({ id: dogId });
        // this.journalsService.getDogMonthlyJournals(userId, dogId, date);

        return { recommendedWalkAmount: dog.breed.recommendedWalkAmount };
    }

    async getDogsStatistics(userId: number): Promise<DogStatisticDto[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        const dogWalkDayIds = await this.getRelatedTableIdList(ownDogIds, 'walkDayId');
        const dailyWalkTimeIds = await this.getRelatedTableIdList(ownDogIds, 'dailyWalkTimeId');
        const breedIds = await this.getRelatedTableIdList(ownDogIds, 'breedId');

        const dogProfiles = await this.getProfileList({ id: In(ownDogIds) });
        const recommendedWalkAmount = await this.breedService.getRecommendedWalkAmountList(breedIds);
        const todayWalkAmount = await this.dailyWalkTimeService.getWalkTimeList(dailyWalkTimeIds);
        const weeklyWalks = await this.dogWalkDayService.getWalkDayList(dogWalkDayIds);

        const length = ownDogIds.length;
        if (
            dogProfiles.length !== length ||
            recommendedWalkAmount.length !== length ||
            todayWalkAmount.length !== length ||
            weeklyWalks.length !== length
        ) {
            const error = new NotFoundException(
                `Data not matched - Check dogs / breed / dog_walk_day / daily_walk_time table for dogId: ${ownDogIds}.`
            );
            this.logger.error(`Data not matched for dogId-${ownDogIds}.`, error.stack ?? 'No stack');
            throw error;
        }

        return this.makeStatisticData(dogProfiles, recommendedWalkAmount, todayWalkAmount, weeklyWalks);
    }
}
