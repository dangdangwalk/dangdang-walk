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
exports.DogWalkDayService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const dog_walk_day_entity_1 = require("./dog-walk-day.entity");
const dog_walk_day_repository_1 = require("./dog-walk-day.repository");
const winstonLogger_service_1 = require("../common/logger/winstonLogger.service");
const date_util_1 = require("../utils/date.util");
const manipulate_util_1 = require("../utils/manipulate.util");
let DogWalkDayService = class DogWalkDayService {
    constructor(dogWalkDayRepository, entityManager, logger) {
        this.dogWalkDayRepository = dogWalkDayRepository;
        this.entityManager = entityManager;
        this.logger = logger;
    }
    async updateIfStaleAndGetWeeklyWalks(dogWalkDay) {
        const lastSunday = (0, date_util_1.getLastSunday)();
        if (dogWalkDay.updatedAt < lastSunday) {
            const weeklyCountReset = { mon: 0, tue: 0, wed: 0, thr: 0, fri: 0, sat: 0, sun: 0 };
            await this.dogWalkDayRepository.update({ id: dogWalkDay.id }, weeklyCountReset);
            return Object.values(weeklyCountReset);
        }
        return Object.values((0, manipulate_util_1.makeSubObject)(dogWalkDay, ['mon', 'tue', 'wed', 'thr', 'fri', 'sat', 'sun']));
    }
    async updateDailyWalkCount(dogWalkDayIds, operation) {
        const weekDay = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
        const today = new Date().getDay();
        const day = weekDay[today];
        const findDogWalkDays = await this.dogWalkDayRepository.find({ where: { id: (0, typeorm_1.In)(dogWalkDayIds) } });
        const updateEntities = findDogWalkDays.map((curDogWalkDay) => {
            const dogWalkDayCount = curDogWalkDay[day];
            return new dog_walk_day_entity_1.DogWalkDay({ id: curDogWalkDay.id, [day]: operation(dogWalkDayCount) });
        });
        await this.entityManager
            .createQueryBuilder(dog_walk_day_entity_1.DogWalkDay, 'dogWalkDay')
            .insert()
            .into(dog_walk_day_entity_1.DogWalkDay, ['id', day])
            .values(updateEntities)
            .orUpdate([day], ['id'])
            .execute();
    }
    async delete(where) {
        return await this.dogWalkDayRepository.delete(where);
    }
};
exports.DogWalkDayService = DogWalkDayService;
exports.DogWalkDayService = DogWalkDayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dog_walk_day_repository_1.DogWalkDayRepository,
        typeorm_1.EntityManager,
        winstonLogger_service_1.WinstonLoggerService])
], DogWalkDayService);
//# sourceMappingURL=dog-walk-day.service.js.map