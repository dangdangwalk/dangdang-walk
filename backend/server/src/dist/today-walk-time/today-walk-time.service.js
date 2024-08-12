"use strict";
Object.defineProperty(exports, "TodayWalkTimeService", {
    enumerable: true,
    get: function() {
        return TodayWalkTimeService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _todaywalktimeentity = require("./today-walk-time.entity");
const _todaywalktimerepository = require("./today-walk-time.repository");
const _winstonLoggerservice = require("../common/logger/winstonLogger.service");
const _dateutil = require("../utils/date.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TodayWalkTimeService = class TodayWalkTimeService {
    async delete(where) {
        return await this.todayWalkTimeRepository.delete(where);
    }
    async updateIfStaleAndGetDuration(todayWalkTime) {
        const startOfToday = (0, _dateutil.getStartOfToday)();
        if (todayWalkTime.updatedAt < startOfToday) {
            await this.todayWalkTimeRepository.update({
                id: todayWalkTime.id
            }, {
                duration: 0
            });
            return 0;
        }
        return todayWalkTime.duration;
    }
    async updateDurations(walkTimeIds, duration, operation) {
        const todayWalkTimes = await this.findWalkTimesByIds(walkTimeIds);
        if (!todayWalkTimes.length) {
            const error = new _common.NotFoundException(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`);
            var _error_stack;
            this.logger.error(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음'
            });
            throw error;
        }
        const updateEntities = todayWalkTimes.map((cur)=>new _todaywalktimeentity.TodayWalkTime({
                id: cur.id,
                duration: operation(cur.duration, duration)
            }));
        await this.entityManager.createQueryBuilder(_todaywalktimeentity.TodayWalkTime, 'todayWalkTime').insert().into(_todaywalktimeentity.TodayWalkTime, [
            'id',
            'duration'
        ]).values(updateEntities).orUpdate([
            'duration'
        ], [
            'id'
        ]).execute();
    }
    async findWalkTimesByIds(walkTimeIds) {
        return await this.todayWalkTimeRepository.find({
            where: {
                id: (0, _typeorm.In)(walkTimeIds)
            }
        });
    }
    constructor(todayWalkTimeRepository, logger, entityManager){
        this.todayWalkTimeRepository = todayWalkTimeRepository;
        this.logger = logger;
        this.entityManager = entityManager;
    }
};
TodayWalkTimeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _todaywalktimerepository.TodayWalkTimeRepository === "undefined" ? Object : _todaywalktimerepository.TodayWalkTimeRepository,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService,
        typeof _typeorm.EntityManager === "undefined" ? Object : _typeorm.EntityManager
    ])
], TodayWalkTimeService);

//# sourceMappingURL=today-walk-time.service.js.map