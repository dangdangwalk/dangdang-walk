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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const winstonLogger_service_1 = require("../common/logger/winstonLogger.service");
const dog_walk_day_service_1 = require("../dog-walk-day/dog-walk-day.service");
const dogs_service_1 = require("../dogs/dogs.service");
const journals_service_1 = require("../journals/journals.service");
const today_walk_time_service_1 = require("../today-walk-time/today-walk-time.service");
const users_service_1 = require("../users/users.service");
const date_util_1 = require("../utils/date.util");
const manipulate_util_1 = require("../utils/manipulate.util");
let StatisticsService = class StatisticsService {
    constructor(usersService, dogsService, dogWalkDayService, todayWalkTimeService, journalsService, logger) {
        this.usersService = usersService;
        this.dogsService = dogsService;
        this.dogWalkDayService = dogWalkDayService;
        this.todayWalkTimeService = todayWalkTimeService;
        this.journalsService = journalsService;
        this.logger = logger;
    }
    async getDogMonthlyWalkingTotal(userId, dogId, period) {
        let startDate, endDate;
        if (period === 'month') {
            ({ startDate, endDate } = (0, date_util_1.getOneMonthAgo)(new Date()));
        }
        else {
            throw new common_1.BadRequestException(`유효하지 않은 period: ${period}`);
        }
        return this.journalsService.findJournalsAndGetTotal(userId, dogId, startDate, endDate);
    }
    async getDogDailyWalkCountsByPeriod(userId, dogId, date, period) {
        let startDate, endDate;
        if (period === 'month') {
            ({ startDate, endDate } = (0, date_util_1.getStartAndEndOfMonth)(new Date(date)));
        }
        else if (period === 'week') {
            ({ startDate, endDate } = (0, date_util_1.getStartAndEndOfWeek)(new Date(date)));
        }
        else {
            throw new common_1.BadRequestException(`유효하지 않은 period: ${period}`);
        }
        return this.journalsService.findJournalsAndAggregateByDay(userId, dogId, startDate, endDate);
    }
    async getDogsWeeklyWalkingOverview(userId) {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        const ownDogInfos = await this.dogsService.find({
            where: { id: (0, typeorm_1.In)(ownDogIds) },
            select: ['id', 'name', 'profilePhotoUrl', 'breed', 'todayWalkTime', 'walkDay'],
            relations: {
                walkDay: true,
                todayWalkTime: true,
            },
        });
        return await Promise.all(ownDogInfos.map(async (ownDogInfo) => ({
            ...(0, manipulate_util_1.makeSubObject)(ownDogInfo, ['id', 'name', 'profilePhotoUrl']),
            recommendedWalkAmount: ownDogInfo.breed.recommendedWalkAmount,
            todayWalkAmount: await this.todayWalkTimeService.updateIfStaleAndGetDuration(ownDogInfo.todayWalkTime),
            weeklyWalks: await this.dogWalkDayService.updateIfStaleAndGetWeeklyWalks(ownDogInfo.walkDay),
        })));
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        dogs_service_1.DogsService,
        dog_walk_day_service_1.DogWalkDayService,
        today_walk_time_service_1.TodayWalkTimeService,
        journals_service_1.JournalsService,
        winstonLogger_service_1.WinstonLoggerService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map