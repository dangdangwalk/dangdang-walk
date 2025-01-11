import { ConflictException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BreedService } from 'applications/breed';
import { DogWalkDay } from 'applications/dog-walk-day/dog-walk-day.entity';
import { DogWalkDayService } from 'applications/dog-walk-day/dog-walk-day.service';
import { TodayWalkTime } from 'applications/today-walk-time/today-walk-time.entity';
import { TodayWalkTimeService } from 'applications/today-walk-time/today-walk-time.service';
import { UsersDogs } from 'applications/users-dogs/users-dogs.entity';
import { UsersDogsService } from 'applications/users-dogs/users-dogs.service';
import { EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { EVENTS } from 'utils/etc';

import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';

import { CreateDogRequest, DogProfileResponse, DogSummaryResponse, UpdateDogRequest } from './types/dogs.type';

import { S3Service } from '../../s3/s3.service';
import { UsersService } from '../../users/users.service';

import { makeSubObject, makeSubObjectsArray } from '../../utils/manipulate.util';

@Injectable()
export class DogsService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly dogsRepository: DogsRepository,
        private readonly usersService: UsersService,
        private readonly usersDogsService: UsersDogsService,
        private readonly breedService: BreedService,
        private readonly dogWalkDayService: DogWalkDayService,
        private readonly todayWalkTimeService: TodayWalkTimeService,
        private readonly s3Service: S3Service,
        private readonly entityManager: EntityManager,
    ) {}

    @Transactional()
    async createDogToUser(userId: number, dogDto: CreateDogRequest): Promise<void> {
        const { breed: breedName, ...otherAttributes } = dogDto;

        const breed = await this.breedService.findOne({ where: { koreanName: breedName } });

        const newDog = new Dogs({
            breed,
            walkDay: new DogWalkDay({}),
            todayWalkTime: new TodayWalkTime({}),
            ...otherAttributes,
        });

        const dog = await this.dogsRepository.create(newDog);

        await this.usersDogsService.create({ userId, dogId: dog.id });
        this.eventEmitter.emit(EVENTS.DOG_CREATED, { userId });
    }

    @Transactional()
    async deleteDogFromUser(userId: number, dogId: number): Promise<void> {
        const dog = await this.dogsRepository.findOne({ where: { id: dogId } });

        if (dog.isWalking) {
            throw new ConflictException(`강아지 ${dog.id}은/는 산책 중입니다. 삭제할 수 없습니다`);
        }

        await this.dogWalkDayService.delete({ id: dog.walkDayId });
        await this.todayWalkTimeService.delete({ id: dog.todayWalkTimeId });
        if (dog.profilePhotoUrl) {
            await this.s3Service.deleteSingleObject(userId, dog.profilePhotoUrl);
        }
        this.eventEmitter.emit(EVENTS.DOG_DELETED, { userId });
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

    async updateDog(userId: number, dogId: number, dogDto: UpdateDogRequest): Promise<void> {
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
        await this.dogsRepository.update({ id: dogId }, updateData);
        this.eventEmitter.emit(EVENTS.DOG_UPDATED, { userId });
    }

    async updateIsWalking(dogIds: number | number[], stateToUpdate: boolean) {
        dogIds = Array.isArray(dogIds) ? dogIds : [dogIds];

        const attrs = {
            isWalking: stateToUpdate,
        };

        await this.dogsRepository.update({ id: In(dogIds) }, attrs);

        return dogIds;
    }

    private makeProfile(dogInfo: Dogs): DogProfileResponse {
        return {
            ...makeSubObject(dogInfo, DogProfileResponse.getFieldsForDogTableAndRaw()),
            breed: dogInfo.breed.koreanName,
        };
    }

    private makeDogsSummaryList(dogs: Dogs[]): DogSummaryResponse[] {
        return makeSubObjectsArray(dogs, DogSummaryResponse.getFieldsForDogTableAndRaw());
    }

    async getDogsSummaryList(where: FindOptionsWhere<Dogs>): Promise<DogSummaryResponse[]> {
        const dogInfos = await this.dogsRepository.find({
            where,
            select: DogSummaryResponse.getFieldsForDogTableAndRaw(),
        });
        return this.makeDogsSummaryList(dogInfos);
    }

    async getProfile(dogId: number): Promise<DogProfileResponse> {
        const dogInfo = await this.dogsRepository.findOne({
            where: { id: dogId },
            select: DogProfileResponse.getFieldsForDogTableAndRaw(),
        });
        return this.makeProfile(dogInfo);
    }

    async getProfileList(userId: number): Promise<DogProfileResponse[]> {
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
