"use strict";
Object.defineProperty(exports, "AuthDogGuard", {
    enumerable: true,
    get: function() {
        return AuthDogGuard;
    }
});
const _common = require("@nestjs/common");
const _winstonLoggerservice = require("../../common/logger/winstonLogger.service");
const _usersservice = require("../../users/users.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthDogGuard = class AuthDogGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const dogId = this.getDogId(request);
        await this.checkDogOwnership(userId, dogId);
        return true;
    }
    getDogId(request) {
        const id = request.query.dogId || request.params.id;
        if (!this.isInt(id)) {
            const error = new _common.BadRequestException('dogId가 정수가 아닙니다');
            var _error_stack;
            this.logger.error('dogId가 정수가 아닙니다', {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음'
            });
            throw error;
        }
        return parseInt(id);
    }
    async checkDogOwnership(userId, dogId) {
        const [owned] = await this.usersService.checkDogOwnership(userId, dogId);
        if (!owned) {
            const error = new _common.ForbiddenException(`유저 ${userId}은/는 강아지${dogId}의 주인이 아닙니다`);
            var _error_stack;
            this.logger.error(`유저 ${userId}은/는 ${dogId}의 주인이 아닙니다`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음'
            });
            throw error;
        }
    }
    isInt(value) {
        const regex = /^\d+$/;
        return regex.test(value);
    }
    constructor(usersService, logger){
        this.usersService = usersService;
        this.logger = logger;
    }
};
AuthDogGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], AuthDogGuard);

//# sourceMappingURL=auth-dog.guard.js.map