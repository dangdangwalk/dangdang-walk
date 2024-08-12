"use strict";
Object.defineProperty(exports, "StatisticsController", {
    enumerable: true,
    get: function() {
        return StatisticsController;
    }
});
const _common = require("@nestjs/common");
const _datevalidationpipe = require("./pipes/date-validation.pipe");
const _periodvalidationpipe = require("./pipes/period-validation.pipe");
const _statisticsservice = require("./statistics.service");
const _tokenservice = require("../auth/token/token.service");
const _authdogguard = require("../dogs/guards/auth-dog.guard");
const _userdecorator = require("../users/decorators/user.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let StatisticsController = class StatisticsController {
    async getDogMonthlyWalkingTotal({ userId }, dogId, period) {
        return await this.statisticsService.getDogMonthlyWalkingTotal(userId, dogId, period);
    }
    async getDogDailyWalkCountsByPeriod({ userId }, dogId, date, period) {
        return await this.statisticsService.getDogDailyWalkCountsByPeriod(userId, dogId, date, period);
    }
    async getDogsWeeklyWalkingOverview({ userId }) {
        return await this.statisticsService.getDogsWeeklyWalkingOverview(userId);
    }
    constructor(statisticsService){
        this.statisticsService = statisticsService;
    }
};
_ts_decorate([
    (0, _common.Get)('/:id(\\d+)/statistics/recent'),
    (0, _common.UseGuards)(_authdogguard.AuthDogGuard),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_param(1, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Query)('period', new _periodvalidationpipe.PeriodValidationPipe([
        'month'
    ]))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload,
        Number,
        typeof _periodvalidationpipe.Period === "undefined" ? Object : _periodvalidationpipe.Period
    ]),
    _ts_metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDogMonthlyWalkingTotal", null);
_ts_decorate([
    (0, _common.Get)('/:id(\\d+)/statistics'),
    (0, _common.UseGuards)(_authdogguard.AuthDogGuard),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_param(1, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Query)('date', _datevalidationpipe.DateValidationPipe)),
    _ts_param(3, (0, _common.Query)('period', new _periodvalidationpipe.PeriodValidationPipe([
        'month',
        'week'
    ]))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload,
        Number,
        String,
        typeof _periodvalidationpipe.Period === "undefined" ? Object : _periodvalidationpipe.Period
    ]),
    _ts_metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDogDailyWalkCountsByPeriod", null);
_ts_decorate([
    (0, _common.Get)('/statistics'),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload
    ]),
    _ts_metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDogsWeeklyWalkingOverview", null);
StatisticsController = _ts_decorate([
    (0, _common.Controller)('/dogs'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _statisticsservice.StatisticsService === "undefined" ? Object : _statisticsservice.StatisticsService
    ])
], StatisticsController);

//# sourceMappingURL=statistics.controller.js.map