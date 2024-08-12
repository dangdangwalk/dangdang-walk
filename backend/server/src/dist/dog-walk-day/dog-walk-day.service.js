"use strict";
Object.defineProperty(exports, "DogWalkDayService", {
    enumerable: true,
    get: function() {
        return DogWalkDayService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _dogwalkdayentity = require("./dog-walk-day.entity");
const _dogwalkdayrepository = require("./dog-walk-day.repository");
const _winstonLoggerservice = require("../common/logger/winstonLogger.service");
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
let DogWalkDayService = class DogWalkDayService {
    async updateIfStaleAndGetWeeklyWalks(dogWalkDay) {
        const lastSunday = (0, _dateutil.getLastSunday)();
        if (dogWalkDay.updatedAt < lastSunday) {
            const weeklyCountReset = {
                mon: 0,
                tue: 0,
                wed: 0,
                thr: 0,
                fri: 0,
                sat: 0,
                sun: 0
            };
            await this.dogWalkDayRepository.update({
                id: dogWalkDay.id
            }, weeklyCountReset);
            return Object.values(weeklyCountReset);
        }
        return Object.values((0, _manipulateutil.makeSubObject)(dogWalkDay, [
            'mon',
            'tue',
            'wed',
            'thr',
            'fri',
            'sat',
            'sun'
        ]));
    }
    async updateDailyWalkCount(dogWalkDayIds, operation) {
        const weekDay = [
            'sun',
            'mon',
            'tue',
            'wed',
            'thr',
            'fri',
            'sat'
        ];
        const today = new Date().getDay();
        const day = weekDay[today];
        const findDogWalkDays = await this.dogWalkDayRepository.find({
            where: {
                id: (0, _typeorm.In)(dogWalkDayIds)
            }
        });
        const updateEntities = findDogWalkDays.map((curDogWalkDay)=>{
            const dogWalkDayCount = curDogWalkDay[day];
            return new _dogwalkdayentity.DogWalkDay({
                id: curDogWalkDay.id,
                [day]: operation(dogWalkDayCount)
            });
        });
        await this.entityManager.createQueryBuilder(_dogwalkdayentity.DogWalkDay, 'dogWalkDay').insert().into(_dogwalkdayentity.DogWalkDay, [
            'id',
            day
        ]).values(updateEntities).orUpdate([
            day
        ], [
            'id'
        ]).execute();
    }
    async delete(where) {
        return await this.dogWalkDayRepository.delete(where);
    }
    constructor(dogWalkDayRepository, entityManager, logger){
        this.dogWalkDayRepository = dogWalkDayRepository;
        this.entityManager = entityManager;
        this.logger = logger;
    }
};
DogWalkDayService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dogwalkdayrepository.DogWalkDayRepository === "undefined" ? Object : _dogwalkdayrepository.DogWalkDayRepository,
        typeof _typeorm.EntityManager === "undefined" ? Object : _typeorm.EntityManager,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], DogWalkDayService);

//# sourceMappingURL=dog-walk-day.service.js.map