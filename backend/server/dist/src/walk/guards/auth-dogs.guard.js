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
exports.AuthDogsGuard = void 0;
const common_1 = require("@nestjs/common");
const winstonLogger_service_1 = require("../../common/logger/winstonLogger.service");
const users_service_1 = require("../../users/users.service");
const validator_util_1 = require("../../utils/validator.util");
let AuthDogsGuard = class AuthDogsGuard {
    constructor(usersService, logger) {
        this.usersService = usersService;
        this.logger = logger;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const dogIds = this.getDogIds(request);
        await this.checkDogOwnership(userId, dogIds);
        return true;
    }
    getDogIds(request) {
        const body = request.body.dogs || request.body;
        if (!(0, validator_util_1.isTypedArray)(body, 'number')) {
            const error = new common_1.BadRequestException('유효하지 않은 request body: dogIds가 number 타입의 배열이 아닙니다');
            this.logger.error('유효하지 않은 request body: dogIds가 number 타입의 배열이 아닙니다', {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }
        return body;
    }
    async checkDogOwnership(userId, dogIds) {
        const [owned, notFoundDogIds] = await this.usersService.checkDogOwnership(userId, dogIds);
        if (!owned) {
            const error = new common_1.ForbiddenException(`유저 ${userId}은/는 다음 강아지(들)에 대한 접근 권한이 없습니다: ${notFoundDogIds.join(', ')}`);
            this.logger.error(`유저 ${userId}은/는 다음 강아지(들)에 대한 접근 권한이 없습니다: ${notFoundDogIds.join(', ')}`, {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }
    }
};
exports.AuthDogsGuard = AuthDogsGuard;
exports.AuthDogsGuard = AuthDogsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        winstonLogger_service_1.WinstonLoggerService])
], AuthDogsGuard);
//# sourceMappingURL=auth-dogs.guard.js.map