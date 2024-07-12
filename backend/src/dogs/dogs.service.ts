import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, In } from 'typeorm';
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
import { UsersService } from '../users/users.service';
import { UsersDogs } from '../users-dogs/users-dogs.entity';
import { UsersDogsService } from '../users-dogs/users-dogs.service';

import { makeSubObject, makeSubObjectsArray } from '../utils/manipulate.util';

@Injectable()
export class DogsService {
    constructor(
        private readonly dogsRepository: DogsRepository,
        private readonly usersService: UsersService,
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

            const breed = await this.breedService.findOne({ where: { koreanName: breedName } });

            const newDog = new Dogs({
                breed,
                walkDay: new DogWalkDay({}),
                todayWalkTime: new TodayWalkTime({}),
                ...otherAttributes,
            });

            const dog = await this.dogsRepository.create(newDog);

            return await this.usersDogsService.create({ userId, dogId: dog.id });
        } catch (error) {
            this.logger.error(`존재하지 않는 견종입니다`, { trace: error.stack ?? '스택 없음' });
            throw error;
        }
    }

    @Transactional()
    async deleteDogFromUser(userId: number, dogId: number) {
        const dog = await this.dogsRepository.findOne({ where: { id: dogId } });

        if (dog.isWalking) {
            const error = new ConflictException(`강아지 ${dog.id}은/는 산책 중입니다. 삭제할 수 없습니다`);
            this.logger.error(`강아지 ${dog.id}은/는 산책 중입니다. 삭제할 수 없습니다`, {
                trace: error.stack ?? '스택 없음',
            });
            throw error;
        }

        await this.dogWalkDayService.delete({ id: dog.walkDayId });
        await this.todayWalkTimeService.delete({ id: dog.todayWalkTimeId });
        if (dog.profilePhotoUrl) {
            await this.s3Service.deleteSingleObject(userId, dog.profilePhotoUrl);
        }
        return dog;
    }

    @Transactional()
    async deleteOwnDogs(userId: number) {
        const dogIds = await this.usersService.getOwnDogsList(userId);

        if (!dogIds.length) return;

        const dogs = await this.dogsRepository.find({
            where: { id: In(dogIds) },
            select: ['walkDayId', 'todayWalkTimeId', 'profilePhotoUrl'],
        });

        const walkDayIds = dogs.map((dog) => dog.walkDayId);
        const todayWalkTimeIds = dogs.map((dog) => dog.todayWalkTimeId);
        const profilePhotoUrls = dogs.map((dog) => dog.profilePhotoUrl).filter((url): url is string => url !== null);

        await Promise.all([
            this.dogWalkDayService.delete({ id: In(walkDayIds) }),
            this.todayWalkTimeService.delete({ id: In(todayWalkTimeIds) }),
            profilePhotoUrls.length ? this.s3Service.deleteObjects(userId, profilePhotoUrls) : Promise.resolve(),
        ]);
    }

    async find(where: FindManyOptions<Dogs>): Promise<Dogs[]> {
        return await this.dogsRepository.find(where);
    }

    async findOne(where: FindOneOptions<Dogs>) {
        return await this.dogsRepository.findOne(where);
    }

    async updateDog(userId: number, dogId: number, dogDto: Partial<DogData>) {
        const { breed: breedName, ...otherAttributes } = dogDto;
        let breed;

        if (breedName) {
            breed = await this.breedService.findOne({ where: { koreanName: breedName } });
        }

        if (dogDto.profilePhotoUrl) {
            const curDogInfo = await this.dogsRepository.findOne({ where: { id: dogId } });
            if (curDogInfo && curDogInfo.profilePhotoUrl) {
                await this.s3Service.deleteSingleObject(userId, curDogInfo.profilePhotoUrl);
            }
        }

        const updateData = breed ? { breedId: breed.id, ...otherAttributes } : otherAttributes;
        return await this.dogsRepository.update({ id: dogId }, updateData);
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
            ...makeSubObject(dogInfo, ['id', 'name', 'gender', 'isNeutered', 'birth', 'weight', 'profilePhotoUrl']),
            breed: dogInfo.breed.koreanName,
        };
    }

    private makeDogsSummaryList(dogs: Dogs[]): DogSummary[] {
        //TODO: key를 반환하는 함수 만들어 인자로 넣기
        return makeSubObjectsArray(dogs, ['id', 'name', 'profilePhotoUrl']);
    }

    async getDogsSummaryList(where: FindOptionsWhere<Dogs>): Promise<DogSummary[]> {
        const dogInfos = await this.dogsRepository.find({ where, select: ['id', 'name', 'profilePhotoUrl'] });
        return this.makeDogsSummaryList(dogInfos);
    }

    async getProfile(dogId: number): Promise<DogProfile> {
        const dogInfo = await this.dogsRepository.findOne({
            where: { id: dogId },
            select: ['id', 'name', 'breed', 'gender', 'isNeutered', 'birth', 'weight', 'profilePhotoUrl'],
        });
        return this.makeProfile(dogInfo);
    }

    async getProfileList(userId: number): Promise<DogProfile[]> {
        const dogInfos = await this.entityManager
            .createQueryBuilder(Dogs, 'dogs')
            .innerJoin(UsersDogs, 'users_dogs', 'users_dogs.dogId = dogs.id')
            .innerJoinAndSelect('dogs.breed', 'breed')
            .where('users_dogs.userId = :userId', { userId })
            .getMany();

        return dogInfos.map((dogInfo) => this.makeProfile(dogInfo));
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
