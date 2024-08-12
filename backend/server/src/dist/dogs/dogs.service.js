"use strict";
Object.defineProperty(exports, "DogsService", {
    enumerable: true,
    get: function() {
        return DogsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _typeormtransactional = require("typeorm-transactional");
const _dogsentity = require("./dogs.entity");
const _dogsrepository = require("./dogs.repository");
const _dogstype = require("./types/dogs.type");
const _breedservice = require("../breed/breed.service");
const _winstonLoggerservice = require("../common/logger/winstonLogger.service");
const _dogwalkdayentity = require("../dog-walk-day/dog-walk-day.entity");
const _dogwalkdayservice = require("../dog-walk-day/dog-walk-day.service");
const _s3service = require("../s3/s3.service");
const _todaywalktimeentity = require("../today-walk-time/today-walk-time.entity");
const _todaywalktimeservice = require("../today-walk-time/today-walk-time.service");
const _usersservice = require("../users/users.service");
const _usersdogsentity = require("../users-dogs/users-dogs.entity");
const _usersdogsservice = require("../users-dogs/users-dogs.service");
const _manipulateutil = require("../utils/manipulate.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DogsService = class DogsService {
    async createDogToUser(userId, dogDto) {
        try {
            const { breed: breedName, ...otherAttributes } = dogDto;
            const breed = await this.breedService.findOne({
                where: {
                    koreanName: breedName
                }
            });
            const newDog = new _dogsentity.Dogs({
                breed,
                walkDay: new _dogwalkdayentity.DogWalkDay({}),
                todayWalkTime: new _todaywalktimeentity.TodayWalkTime({}),
                ...otherAttributes
            });
            const dog = await this.dogsRepository.create(newDog);
            await this.usersDogsService.create({
                userId,
                dogId: dog.id
            });
        } catch (error) {
            var _error_stack;
            this.logger.error(`존재하지 않는 견종입니다`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음'
            });
            throw error;
        }
    }
    async deleteDogFromUser(userId, dogId) {
        const dog = await this.dogsRepository.findOne({
            where: {
                id: dogId
            }
        });
        if (dog.isWalking) {
            const error = new _common.ConflictException(`강아지 ${dog.id}은/는 산책 중입니다. 삭제할 수 없습니다`);
            var _error_stack;
            this.logger.error(`강아지 ${dog.id}은/는 산책 중입니다. 삭제할 수 없습니다`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음'
            });
            throw error;
        }
        await this.dogWalkDayService.delete({
            id: dog.walkDayId
        });
        await this.todayWalkTimeService.delete({
            id: dog.todayWalkTimeId
        });
        if (dog.profilePhotoUrl) {
            await this.s3Service.deleteSingleObject(userId, dog.profilePhotoUrl);
        }
    }
    async deleteOwnDogs(userId) {
        const dogIds = await this.usersService.getOwnDogsList(userId);
        if (!dogIds.length) return;
        const dogs = await this.dogsRepository.find({
            where: {
                id: (0, _typeorm.In)(dogIds)
            },
            select: [
                'walkDayId',
                'todayWalkTimeId',
                'profilePhotoUrl'
            ]
        });
        const walkDayIds = dogs.map((dog)=>dog.walkDayId);
        const todayWalkTimeIds = dogs.map((dog)=>dog.todayWalkTimeId);
        const profilePhotoUrls = dogs.map((dog)=>dog.profilePhotoUrl).filter((url)=>url !== null);
        await Promise.all([
            this.dogWalkDayService.delete({
                id: (0, _typeorm.In)(walkDayIds)
            }),
            this.todayWalkTimeService.delete({
                id: (0, _typeorm.In)(todayWalkTimeIds)
            }),
            profilePhotoUrls.length ? this.s3Service.deleteObjects(userId, profilePhotoUrls) : Promise.resolve()
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
            breed = await this.breedService.findOne({
                where: {
                    koreanName: breedName
                }
            });
        }
        if (dogDto.profilePhotoUrl) {
            const curDogInfo = await this.dogsRepository.findOne({
                where: {
                    id: dogId
                }
            });
            if (curDogInfo && curDogInfo.profilePhotoUrl) {
                await this.s3Service.deleteSingleObject(userId, curDogInfo.profilePhotoUrl);
            }
        }
        const updateData = breed ? {
            breedId: breed.id,
            ...otherAttributes
        } : otherAttributes;
        await this.dogsRepository.update({
            id: dogId
        }, updateData);
    }
    async updateIsWalking(dogIds, stateToUpdate) {
        dogIds = Array.isArray(dogIds) ? dogIds : [
            dogIds
        ];
        const attrs = {
            isWalking: stateToUpdate
        };
        await this.dogsRepository.update({
            id: (0, _typeorm.In)(dogIds)
        }, attrs);
        return dogIds;
    }
    makeProfile(dogInfo) {
        return {
            ...(0, _manipulateutil.makeSubObject)(dogInfo, _dogstype.DogProfileResponse.getFieldsForDogTableAndRaw()),
            breed: dogInfo.breed.koreanName
        };
    }
    makeDogsSummaryList(dogs) {
        return (0, _manipulateutil.makeSubObjectsArray)(dogs, _dogstype.DogSummaryResponse.getFieldsForDogTableAndRaw());
    }
    async getDogsSummaryList(where) {
        const dogInfos = await this.dogsRepository.find({
            where,
            select: _dogstype.DogSummaryResponse.getFieldsForDogTableAndRaw()
        });
        return this.makeDogsSummaryList(dogInfos);
    }
    async getProfile(dogId) {
        const dogInfo = await this.dogsRepository.findOne({
            where: {
                id: dogId
            },
            select: _dogstype.DogProfileResponse.getFieldsForDogTableAndRaw()
        });
        return this.makeProfile(dogInfo);
    }
    async getProfileList(userId) {
        const dogInfos = await this.entityManager.createQueryBuilder(_dogsentity.Dogs, 'dogs').innerJoin(_usersdogsentity.UsersDogs, 'users_dogs', 'users_dogs.dogId = dogs.id').innerJoinAndSelect('dogs.breed', 'breed').where('users_dogs.userId = :userId', {
            userId
        }).getMany();
        return dogInfos.map((dogInfo)=>this.makeProfile(dogInfo));
    }
    async getRelatedTableIdList(ownDogIds, attributeName) {
        const ownDogList = await this.dogsRepository.find({
            where: {
                id: (0, _typeorm.In)(ownDogIds)
            }
        });
        return ownDogList.map((cur)=>{
            return cur[attributeName];
        });
    }
    constructor(dogsRepository, usersService, usersDogsService, breedService, dogWalkDayService, todayWalkTimeService, s3Service, entityManager, logger){
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
};
_ts_decorate([
    (0, _typeormtransactional.Transactional)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _dogstype.CreateDogRequest === "undefined" ? Object : _dogstype.CreateDogRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], DogsService.prototype, "createDogToUser", null);
_ts_decorate([
    (0, _typeormtransactional.Transactional)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], DogsService.prototype, "deleteDogFromUser", null);
_ts_decorate([
    (0, _typeormtransactional.Transactional)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], DogsService.prototype, "deleteOwnDogs", null);
DogsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dogsrepository.DogsRepository === "undefined" ? Object : _dogsrepository.DogsRepository,
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _usersdogsservice.UsersDogsService === "undefined" ? Object : _usersdogsservice.UsersDogsService,
        typeof _breedservice.BreedService === "undefined" ? Object : _breedservice.BreedService,
        typeof _dogwalkdayservice.DogWalkDayService === "undefined" ? Object : _dogwalkdayservice.DogWalkDayService,
        typeof _todaywalktimeservice.TodayWalkTimeService === "undefined" ? Object : _todaywalktimeservice.TodayWalkTimeService,
        typeof _s3service.S3Service === "undefined" ? Object : _s3service.S3Service,
        typeof _typeorm.EntityManager === "undefined" ? Object : _typeorm.EntityManager,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], DogsService);

//# sourceMappingURL=dogs.service.js.map