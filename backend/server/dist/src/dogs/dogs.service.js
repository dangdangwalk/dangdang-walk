"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const dogs_entity_1 = require("./dogs.entity");
const dogs_repository_1 = require("./dogs.repository");
const dogs_type_1 = require("./types/dogs.type");
const breed_service_1 = require("../breed/breed.service");
const winstonLogger_service_1 = require("../common/logger/winstonLogger.service");
const dog_walk_day_entity_1 = require("../dog-walk-day/dog-walk-day.entity");
const dog_walk_day_service_1 = require("../dog-walk-day/dog-walk-day.service");
const s3_service_1 = require("../s3/s3.service");
const today_walk_time_entity_1 = require("../today-walk-time/today-walk-time.entity");
const today_walk_time_service_1 = require("../today-walk-time/today-walk-time.service");
const users_service_1 = require("../users/users.service");
const users_dogs_entity_1 = require("../users-dogs/users-dogs.entity");
const users_dogs_service_1 = require("../users-dogs/users-dogs.service");
const manipulate_util_1 = require("../utils/manipulate.util");
let DogsService = class DogsService {
    constructor(dogsRepository, usersService, usersDogsService, breedService, dogWalkDayService, todayWalkTimeService, s3Service, entityManager, logger) {
        this.dogsRepository = dogsRepository;
        this.usersService = usersService;
        this.usersDogsService = usersDogsService;
        this.breedService = breedService;
        this.dogWalkDayService = dogWalkDayService;
        this.todayWalkTimeService = todayWalkTimeService;
        this.s3Service = s3Service;
        this.entityManager = entityManager;
        this.logger = logger;
    }
    async createDogToUser(userId, dogDto) {
        try {
            const { breed: breedName, ...otherAttributes } = dogDto;
            const breed = await this.breedService.findOne({ where: { koreanName: breedName } });
            const newDog = new dogs_entity_1.Dogs({
                breed,
                walkDay: new dog_walk_day_entity_1.DogWalkDay({}),
                todayWalkTime: new today_walk_time_entity_1.TodayWalkTime({}),
                ...otherAttributes,
            });
            const dog = await this.dogsRepository.create(newDog);
            await this.usersDogsService.create({ userId, dogId: dog.id });
        }
        catch (error) {
            this.logger.error(`존재하지 않는 견종입니다`, { trace: error.stack ?? '스택 없음' });
            throw error;
        }
    }
    async deleteDogFromUser(userId, dogId) {
        const dog = await this.dogsRepository.findOne({ where: { id: dogId } });
        if (dog.isWalking) {
            const error = new common_1.ConflictException(`강아지 ${dog.id}은/는 산책 중입니다. 삭제할 수 없습니다`);
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
    }
    async deleteOwnDogs(userId) {
        const dogIds = await this.usersService.getOwnDogsList(userId);
        if (!dogIds.length)
            return;
        const dogs = await this.dogsRepository.find({
            where: { id: (0, typeorm_1.In)(dogIds) },
            select: ['walkDayId', 'todayWalkTimeId', 'profilePhotoUrl'],
        });
        const walkDayIds = dogs.map((dog) => dog.walkDayId);
        const todayWalkTimeIds = dogs.map((dog) => dog.todayWalkTimeId);
        const profilePhotoUrls = dogs.map((dog) => dog.profilePhotoUrl).filter((url) => url !== null);
        await Promise.all([
            this.dogWalkDayService.delete({ id: (0, typeorm_1.In)(walkDayIds) }),
            this.todayWalkTimeService.delete({ id: (0, typeorm_1.In)(todayWalkTimeIds) }),
            profilePhotoUrls.length ? this.s3Service.deleteObjects(userId, profilePhotoUrls) : Promise.resolve(),
        ]);
    }
    async find(where) {
        return await this.dogsRepository.find(where);
    }
    async findOne(where) {
        return await this.dogsRepository.findOne(where);
    }
    async updateDog(userId, dogId, dogDto) {
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
    }
    async updateIsWalking(dogIds, stateToUpdate) {
        dogIds = Array.isArray(dogIds) ? dogIds : [dogIds];
        const attrs = {
            isWalking: stateToUpdate,
        };
        await this.dogsRepository.update({ id: (0, typeorm_1.In)(dogIds) }, attrs);
        return dogIds;
    }
    makeProfile(dogInfo) {
        return {
            ...(0, manipulate_util_1.makeSubObject)(dogInfo, dogs_type_1.DogProfileResponse.getFieldsForDogTableAndRaw()),
            breed: dogInfo.breed.koreanName,
        };
    }
    makeDogsSummaryList(dogs) {
        return (0, manipulate_util_1.makeSubObjectsArray)(dogs, dogs_type_1.DogSummaryResponse.getFieldsForDogTableAndRaw());
    }
    async getDogsSummaryList(where) {
        const dogInfos = await this.dogsRepository.find({
            where,
            select: dogs_type_1.DogSummaryResponse.getFieldsForDogTableAndRaw(),
        });
        return this.makeDogsSummaryList(dogInfos);
    }
    async getProfile(dogId) {
        const dogInfo = await this.dogsRepository.findOne({
            where: { id: dogId },
            select: dogs_type_1.DogProfileResponse.getFieldsForDogTableAndRaw(),
        });
        return this.makeProfile(dogInfo);
    }
    async getProfileList(userId) {
        const dogInfos = await this.entityManager
            .createQueryBuilder(dogs_entity_1.Dogs, 'dogs')
            .innerJoin(users_dogs_entity_1.UsersDogs, 'users_dogs', 'users_dogs.dogId = dogs.id')
            .innerJoinAndSelect('dogs.breed', 'breed')
            .where('users_dogs.userId = :userId', { userId })
            .getMany();
        return dogInfos.map((dogInfo) => this.makeProfile(dogInfo));
    }
    async getRelatedTableIdList(ownDogIds, attributeName) {
        const ownDogList = await this.dogsRepository.find({ where: { id: (0, typeorm_1.In)(ownDogIds) } });
        return ownDogList.map((cur) => {
            return cur[attributeName];
        });
    }
};
exports.DogsService = DogsService;
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DogsService.prototype, "createDogToUser", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DogsService.prototype, "deleteDogFromUser", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DogsService.prototype, "deleteOwnDogs", null);
exports.DogsService = DogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dogs_repository_1.DogsRepository,
        users_service_1.UsersService,
        users_dogs_service_1.UsersDogsService,
        breed_service_1.BreedService,
        dog_walk_day_service_1.DogWalkDayService,
        today_walk_time_service_1.TodayWalkTimeService,
        s3_service_1.S3Service,
        typeorm_1.EntityManager,
        winstonLogger_service_1.WinstonLoggerService])
], DogsService);
//# sourceMappingURL=dogs.service.js.map