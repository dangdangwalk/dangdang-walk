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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const date_validation_pipe_1 = require("./pipes/date-validation.pipe");
const period_validation_pipe_1 = require("./pipes/period-validation.pipe");
const statistics_service_1 = require("./statistics.service");
const auth_dog_guard_1 = require("../dogs/guards/auth-dog.guard");
const user_decorator_1 = require("../users/decorators/user.decorator");
let StatisticsController = class StatisticsController {
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    async getDogMonthlyWalkingTotal({ userId }, dogId, period) {
        return await this.statisticsService.getDogMonthlyWalkingTotal(userId, dogId, period);
    }
    async getDogDailyWalkCountsByPeriod({ userId }, dogId, date, period) {
        return await this.statisticsService.getDogDailyWalkCountsByPeriod(userId, dogId, date, period);
    }
    async getDogsWeeklyWalkingOverview({ userId }) {
        return await this.statisticsService.getDogsWeeklyWalkingOverview(userId);
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)('/:id(\\d+)/statistics/recent'),
    (0, common_1.UseGuards)(auth_dog_guard_1.AuthDogGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('period', new period_validation_pipe_1.PeriodValidationPipe(['month']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDogMonthlyWalkingTotal", null);
__decorate([
    (0, common_1.Get)('/:id(\\d+)/statistics'),
    (0, common_1.UseGuards)(auth_dog_guard_1.AuthDogGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('date', date_validation_pipe_1.DateValidationPipe)),
    __param(3, (0, common_1.Query)('period', new period_validation_pipe_1.PeriodValidationPipe(['month', 'week']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDogDailyWalkCountsByPeriod", null);
__decorate([
    (0, common_1.Get)('/statistics'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDogsWeeklyWalkingOverview", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, common_1.Controller)('/dogs'),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map