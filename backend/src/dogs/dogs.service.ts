import { Injectable } from '@nestjs/common';
import { EntityManager, FindOptionsWhere, In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';

import { DogData } from './types/dog-data.type';
import { DogProfile } from './types/dog-profile.type';
import { DogSummary } from './types/dog-summary.type';

import { BreedService } from '../breed/breed.service';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';
import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { S3Service } from '../s3/s3.service';
import { TodayWalkTime } from '../today-walk-time/today-walk-time.entity';
import { TodayWalkTimeService } from '../today-walk-time/today-walk-time.service';
import { UsersDogs } from '../users-dogs/users-dogs.entity';
import { UsersDogsService } from '../users-dogs/users-dogs.service';

import { makeSubObjectsArray } from '../utils/manipulate.util';

@Injectable()
export class DogsService {
    constructor(
        private readonly dogsRepository: DogsRepository,
        private readonly usersDogsService: UsersDogsService,
        private readonly breedService: BreedService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly todayWalkTimeService: TodayWalkTimeService,
        private readonly s3Service: S3Service,
        private readonly entityManager: EntityManager,
        private readonly logger: WinstonLoggerService,
    ) {}

    @Transactional()
    async createDogToUser(userId: number, dogDto: DogData) {
        try {
            const { breed: breedName, ...otherAttributes } = dogDto;

            const breed = await this.breedService.findOne({ koreanName: breedName });

            const newDog = new Dogs({
                breed,
                walkDay: new DogWalkDay(),
                todayWalkTime: new TodayWalkTime(),
                ...otherAttributes,
            });

            const dog = await this.dogsRepository.create(newDog);

            return this.usersDogsService.create({ userId, dogId: dog.id });
        } catch (error) {
            this.logger.error(`존재하지 않는 breed입니다`, { trace: error.stack ?? '스택 없음' });
            throw error;
        }
    }

    //TODO: Promise all 사용하여 병렬적으로 삭제 쿼리 날리기
    @Transactional()
    async deleteDogFromUser(userId: number, dogId: number) {
        const dog = await this.dogsRepository.findOne({ id: dogId });

        await this.dogWalkDayService.delete({ id: dog.walkDayId });
        await this.todayWalkTimeService.delete({ id: dog.todayWalkTimeId });
        if (dog.profilePhotoUrl) {
            await this.s3Service.deleteSingleObject(userId, dog.profilePhotoUrl);
        }

        return dog;
    }

    async findOne(where: FindOptionsWhere<Dogs>) {
        return this.dogsRepository.findOne(where);
    }

    async updateDog(userId: number, dogId: number, dogDto: Partial<DogData>) {
        const { breed: breedName, ...otherAttributes } = dogDto;
        let breed;

        if (breedName) {
            breed = await this.breedService.findOne({ koreanName: breedName });
        }

        if (dogDto.profilePhotoUrl) {
            const curDogInfo = await this.dogsRepository.findOne({ id: dogId });
            if (curDogInfo && curDogInfo.profilePhotoUrl) {
                await this.s3Service.deleteSingleObject(userId, curDogInfo.profilePhotoUrl);
            }
        }

        const updateData = breed ? { breedId: breed.id, ...otherAttributes } : otherAttributes;
        return this.dogsRepository.update({ id: dogId }, updateData);
    }

    async updateIsWalking(dogIds: number | number[], stateToUpdate: boolean) {
        dogIds = Array.isArray(dogIds) ? dogIds : [dogIds];

        const attrs = {
            isWalking: stateToUpdate,
        };

        await this.dogsRepository.update({ id: In(dogIds) }, attrs);

        return dogIds;
    }

    private makeProfile(dogInfo: Dogs): DogProfile {
        return {
            id: dogInfo.id,
            name: dogInfo.name,
            breed: dogInfo.breed.koreanName,
            gender: dogInfo.gender,
            isNeutered: dogInfo.isNeutered,
            birth: dogInfo.birth,
            weight: dogInfo.weight,
            profilePhotoUrl: dogInfo.profilePhotoUrl,
        };
    }

    private makeDogsSummaryList(dogs: Dogs[]): DogSummary[] {
        //TODO: key를 반환하는 함수 만들어 인자로 넣기
        return makeSubObjectsArray(dogs, ['id', 'name', 'profilePhotoUrl']);
    }
    //TODO: DogSummary에 해당하는 컬럼을 애초에 select 해서 가져오기
    async getDogsSummaryList(where: FindOptionsWhere<Dogs>): Promise<DogSummary[]> {
        const dogInfos = await this.dogsRepository.find({ where });
        return this.makeDogsSummaryList(dogInfos);
    }

    //TODO : makeProfile 함수로 하지 않고 애초에 select 해서 가져오기
    async getProfile(dogId: number): Promise<DogProfile> {
        const dogInfo = await this.dogsRepository.findOne({ id: dogId });
        return this.makeProfile(dogInfo);
    }

    //TODO: 쿼리 빌더를 쓸 것인지, 각자 테이블에서 가져와서 코드상으로 가공할 것인지 성능 테스트?
    async getProfileList(userId: number): Promise<DogProfile[]> {
        const dogProfiles = await this.entityManager
            .createQueryBuilder(Dogs, 'dogs')
            .innerJoin(UsersDogs, 'users_dogs', 'users_dogs.dogId = dogs.id')
            .innerJoinAndSelect('dogs.breed', 'breed')
            .where('users_dogs.userId = :userId', { userId })
            .getMany();

        return dogProfiles.map((dog) => this.makeProfile(dog));
    }

    async getRelatedTableIdList(
        ownDogIds: number[],
        attributeName: 'walkDayId' | 'todayWalkTimeId' | 'breedId',
    ): Promise<number[]> {
        const ownDogList = await this.dogsRepository.find({ where: { id: In(ownDogIds) } });
        return ownDogList.map((cur) => {
            return cur[attributeName];
        });
    }
}
