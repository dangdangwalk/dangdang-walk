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
exports.TodayWalkTimeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const today_walk_time_entity_1 = require("./today-walk-time.entity");
const today_walk_time_repository_1 = require("./today-walk-time.repository");
const winstonLogger_service_1 = require("../common/logger/winstonLogger.service");
const date_util_1 = require("../utils/date.util");
let TodayWalkTimeService = class TodayWalkTimeService {
    constructor(todayWalkTimeRepository, logger, entityManager) {
        this.todayWalkTimeRepository = todayWalkTimeRepository;
        this.logger = logger;
        this.entityManager = entityManager;
    }
    async delete(where) {
        return await this.todayWalkTimeRepository.delete(where);
    }
    async updateIfStaleAndGetDuration(todayWalkTime) {
        const startOfToday = (0, date_util_1.getStartOfToday)();
        if (todayWalkTime.updatedAt < startOfToday) {
            await this.todayWalkTimeRepository.update({ id: todayWalkTime.id }, { duration: 0 });
            return 0;
        }
        return todayWalkTime.duration;
    }
    async updateDurations(walkTimeIds, duration, operation) {
        const todayWalkTimes = await this.findWalkTimesByIds(walkTimeIds);
        if (!todayWalkTimes.length) {
            const error = new common_1.NotFoundException(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`);
            this.logger.error(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`, {
                trace: error.stack ?? '스택 없음',
            });
            throw error;
        }
        const updateEntities = todayWalkTimes.map((cur) => new today_walk_time_entity_1.TodayWalkTime({ id: cur.id, duration: operation(cur.duration, duration) }));
        await this.entityManager
            .createQueryBuilder(today_walk_time_entity_1.TodayWalkTime, 'todayWalkTime')
            .insert()
            .into(today_walk_time_entity_1.TodayWalkTime, ['id', 'duration'])
            .values(updateEntities)
            .orUpdate(['duration'], ['id'])
            .execute();
    }
    async findWalkTimesByIds(walkTimeIds) {
        return await this.todayWalkTimeRepository.find({ where: { id: (0, typeorm_1.In)(walkTimeIds) } });
    }
};
exports.TodayWalkTimeService = TodayWalkTimeService;
exports.TodayWalkTimeService = TodayWalkTimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [today_walk_time_repository_1.TodayWalkTimeRepository,
        winstonLogger_service_1.WinstonLoggerService,
        typeorm_1.EntityManager])
], TodayWalkTimeService);
//# sourceMappingURL=today-walk-time.service.js.map