"use strict";
Object.defineProperty(exports, "StatisticsService", {
    enumerable: true,
    get: function() {
        return StatisticsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _winstonLoggerservice = require("../common/logger/winstonLogger.service");
const _dogwalkdayservice = require("../dog-walk-day/dog-walk-day.service");
const _dogsservice = require("../dogs/dogs.service");
const _journalsservice = require("../journals/journals.service");
const _todaywalktimeservice = require("../today-walk-time/today-walk-time.service");
const _usersservice = require("../users/users.service");
const _dateutil = require("../utils/date.util");
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
let StatisticsService = class StatisticsService {
    async getDogMonthlyWalkingTotal(userId, dogId, period) {
        let startDate, endDate;
        if (period === 'month') {
            ({ startDate, endDate } = (0, _dateutil.getOneMonthAgo)(new Date()));
        } else {
            throw new _common.BadRequestException(`유효하지 않은 period: ${period}`);
        }
        return this.journalsService.findJournalsAndGetTotal(userId, dogId, startDate, endDate);
    }
    async getDogDailyWalkCountsByPeriod(userId, dogId, date, period) {
        let startDate, endDate;
        if (period === 'month') {
            ({ startDate, endDate } = (0, _dateutil.getStartAndEndOfMonth)(new Date(date)));
        } else if (period === 'week') {
            ({ startDate, endDate } = (0, _dateutil.getStartAndEndOfWeek)(new Date(date)));
        } else {
            throw new _common.BadRequestException(`유효하지 않은 period: ${period}`);
        }
        return this.journalsService.findJournalsAndAggregateByDay(userId, dogId, startDate, endDate);
    }
    async getDogsWeeklyWalkingOverview(userId) {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        const ownDogInfos = await this.dogsService.find({
            where: {
                id: (0, _typeorm.In)(ownDogIds)
            },
            select: [
                'id',
                'name',
                'profilePhotoUrl',
                'breed',
                'todayWalkTime',
                'walkDay'
            ],
            relations: {
                walkDay: true,
                todayWalkTime: true
            }
        });
        return await Promise.all(ownDogInfos.map(async (ownDogInfo)=>({
                ...(0, _manipulateutil.makeSubObject)(ownDogInfo, [
                    'id',
                    'name',
                    'profilePhotoUrl'
                ]),
                recommendedWalkAmount: ownDogInfo.breed.recommendedWalkAmount,
                todayWalkAmount: await this.todayWalkTimeService.updateIfStaleAndGetDuration(ownDogInfo.todayWalkTime),
                weeklyWalks: await this.dogWalkDayService.updateIfStaleAndGetWeeklyWalks(ownDogInfo.walkDay)
            })));
    }
    constructor(usersService, dogsService, dogWalkDayService, todayWalkTimeService, journalsService, logger){
        this.usersService = usersService;
        this.dogsService = dogsService;
        this.dogWalkDayService = dogWalkDayService;
        this.todayWalkTimeService = todayWalkTimeService;
        this.journalsService = journalsService;
        this.logger = logger;
    }
};
StatisticsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _dogsservice.DogsService === "undefined" ? Object : _dogsservice.DogsService,
        typeof _dogwalkdayservice.DogWalkDayService === "undefined" ? Object : _dogwalkdayservice.DogWalkDayService,
        typeof _todaywalktimeservice.TodayWalkTimeService === "undefined" ? Object : _todaywalktimeservice.TodayWalkTimeService,
        typeof _journalsservice.JournalsService === "undefined" ? Object : _journalsservice.JournalsService,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], StatisticsService);

//# sourceMappingURL=statistics.service.js.map