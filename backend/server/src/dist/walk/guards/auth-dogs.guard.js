"use strict";
Object.defineProperty(exports, "AuthDogsGuard", {
    enumerable: true,
    get: function() {
        return AuthDogsGuard;
    }
});
const _common = require("@nestjs/common");
const _winstonLoggerservice = require("../../common/logger/winstonLogger.service");
const _usersservice = require("../../users/users.service");
const _validatorutil = require("../../utils/validator.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthDogsGuard = class AuthDogsGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const dogIds = this.getDogIds(request);
        await this.checkDogOwnership(userId, dogIds);
        return true;
    }
    getDogIds(request) {
        const body = request.body.dogs || request.body;
        if (!(0, _validatorutil.isTypedArray)(body, 'number')) {
            const error = new _common.BadRequestException('유효하지 않은 request body: dogIds가 number 타입의 배열이 아닙니다');
            var _error_stack;
            this.logger.error('유효하지 않은 request body: dogIds가 number 타입의 배열이 아닙니다', {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : 'No stack'
            });
            throw error;
        }
        return body;
    }
    async checkDogOwnership(userId, dogIds) {
        const [owned, notFoundDogIds] = await this.usersService.checkDogOwnership(userId, dogIds);
        if (!owned) {
            const error = new _common.ForbiddenException(`유저 ${userId}은/는 다음 강아지(들)에 대한 접근 권한이 없습니다: ${notFoundDogIds.join(', ')}`);
            var _error_stack;
            this.logger.error(`유저 ${userId}은/는 다음 강아지(들)에 대한 접근 권한이 없습니다: ${notFoundDogIds.join(', ')}`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : 'No stack'
            });
            throw error;
        }
    }
    constructor(usersService, logger){
        this.usersService = usersService;
        this.logger = logger;
    }
};
AuthDogsGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], AuthDogsGuard);

//# sourceMappingURL=auth-dogs.guard.js.map