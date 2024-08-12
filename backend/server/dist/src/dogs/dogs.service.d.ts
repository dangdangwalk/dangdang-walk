import { EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';
import { CreateDogRequest, UpdateDogRequest, DogProfileResponse, DogSummaryResponse } from './types/dogs.type';
import { BreedService } from '../breed/breed.service';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogWalkDayService } from '../dog-walk-day/dog-walk-day.service';
import { S3Service } from '../s3/s3.service';
import { TodayWalkTimeService } from '../today-walk-time/today-walk-time.service';
import { UsersService } from '../users/users.service';
import { UsersDogsService } from '../users-dogs/users-dogs.service';
export declare class DogsService {
    private readonly dogsRepository;
    private readonly usersService;
    private readonly usersDogsService;
    private readonly breedService;
    private readonly dogWalkDayService;
    private readonly todayWalkTimeService;
    private readonly s3Service;
    private readonly entityManager;
    private readonly logger;
    constructor(
        dogsRepository: DogsRepository,
        usersService: UsersService,
        usersDogsService: UsersDogsService,
        breedService: BreedService,
        dogWalkDayService: DogWalkDayService,
        todayWalkTimeService: TodayWalkTimeService,
        s3Service: S3Service,
        entityManager: EntityManager,
        logger: WinstonLoggerService,
    );
    createDogToUser(userId: number, dogDto: CreateDogRequest): Promise<void>;
    deleteDogFromUser(userId: number, dogId: number): Promise<void>;
    deleteOwnDogs(userId: number): Promise<void>;
    find(where: FindManyOptions<Dogs>): Promise<Dogs[]>;
    findOne(where: FindOneOptions<Dogs>): Promise<Dogs>;
    updateDog(userId: number, dogId: number, dogDto: UpdateDogRequest): Promise<void>;
    updateIsWalking(dogIds: number | number[], stateToUpdate: boolean): Promise<number[]>;
    private makeProfile;
    private makeDogsSummaryList;
    getDogsSummaryList(where: FindOptionsWhere<Dogs>): Promise<DogSummaryResponse[]>;
    getProfile(dogId: number): Promise<DogProfileResponse>;
    getProfileList(userId: number): Promise<DogProfileResponse[]>;
    getRelatedTableIdList(
        ownDogIds: number[],
        attributeName: 'walkDayId' | 'todayWalkTimeId' | 'breedId',
    ): Promise<number[]>;
}
