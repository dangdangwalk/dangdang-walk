import { Injectable, NotFoundException } from '@nestjs/common';
import { Dogs } from './dogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DogProfile } from './dogs.controller';
import { UsersService } from 'src/users/users.service';
import { BreedService } from 'src/breed/breed.service';
import { DogWalkDayService } from 'src/dog-walk-day/dog-walk-day.service';
import { DailyWalkTimeService } from 'src/daily-walk-time/daily-walk-time.service';
import { DogStatisticDto } from './dto/dog-statistic.dto';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';

@Injectable()
export class DogsService {
    constructor(
        @InjectRepository(Dogs) private repo: Repository<Dogs>,
        private readonly usersService: UsersService,
        private readonly breedService: BreedService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly dailyWalkTimeService: DailyWalkTimeService,
        private readonly logger: WinstonLoggerService
    ) {}

    async update(id: number, attrs: Partial<Dogs>) {
        const dog = await this.repo.findOne({ where: { id } });
        if (!dog) {
            throw new NotFoundException();
        }
        Object.assign(dog, attrs);
        return this.repo.save(dog);
    }

    async findDogsList(ownDogIds: number[]) {
        const ownDogList = await this.repo.find({ where: { id: In(ownDogIds) } });
        return ownDogList;
    }

    async updateIsWalking(dogIds: number[], stateToUpdate: boolean) {
        const attrs = {
            isWalking: stateToUpdate,
        };
        for (const curDogId of dogIds) {
            await this.update(curDogId, attrs);
        }
        return dogIds;
    }

    //TODO : 한 메소드에 역할이 두개인 느낌
    async truncateNotAvaialableDog(ownDogIds: number[]): Promise<DogProfile[]> {
        const availableDogList = await this.repo.find({ where: { id: In(ownDogIds), isWalking: false } });
        const availableDogProfileList = this.makeProfileList(availableDogList);
        return availableDogProfileList;
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

    async getProfileList(dogIds: number[]): Promise<DogProfile[]> {
        const ownDogList = await this.findDogsList(dogIds);
        return this.makeProfileList(ownDogList);
    }

    //TODO : 중복 코드 제거
    async getDogWalkDayIdList(ownDogIds: number[]): Promise<number[]> {
        const ownDogList = await this.findDogsList(ownDogIds);
        return ownDogList.map((cur) => {
            return cur.walkDayId;
        });
    }

    async getDailyWalkTimeIdList(ownDogIds: number[]): Promise<number[]> {
        const ownDogList = await this.findDogsList(ownDogIds);
        return ownDogList.map((cur) => {
            return cur.dailyWalkTimeId;
        });
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
        const dogWalkDayIds = await this.getDogWalkDayIdList(ownDogIds);
        const dailyWalkTimeIds = await this.getDailyWalkTimeIdList(ownDogIds);

        const dogProfiles = await this.getProfileList(ownDogIds);
        const recommendedDailyWalkAmount = await this.breedService.getActivityList(ownDogIds);
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
