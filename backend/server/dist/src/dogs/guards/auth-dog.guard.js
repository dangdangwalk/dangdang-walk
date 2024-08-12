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
exports.AuthDogGuard = void 0;
const common_1 = require("@nestjs/common");
const winstonLogger_service_1 = require("../../common/logger/winstonLogger.service");
const users_service_1 = require("../../users/users.service");
let AuthDogGuard = class AuthDogGuard {
    constructor(usersService, logger) {
        this.usersService = usersService;
        this.logger = logger;
    }
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
            const error = new common_1.BadRequestException('dogId가 정수가 아닙니다');
            this.logger.error('dogId가 정수가 아닙니다', {
                trace: error.stack ?? '스택 없음',
            });
            throw error;
        }
        return parseInt(id);
    }
    async checkDogOwnership(userId, dogId) {
        const [owned] = await this.usersService.checkDogOwnership(userId, dogId);
        if (!owned) {
            const error = new common_1.ForbiddenException(`유저 ${userId}은/는 강아지${dogId}의 주인이 아닙니다`);
            this.logger.error(`유저 ${userId}은/는 ${dogId}의 주인이 아닙니다`, { trace: error.stack ?? '스택 없음' });
            throw error;
        }
    }
    isInt(value) {
        const regex = /^\d+$/;
        return regex.test(value);
    }
};
exports.AuthDogGuard = AuthDogGuard;
exports.AuthDogGuard = AuthDogGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        winstonLogger_service_1.WinstonLoggerService])
], AuthDogGuard);
//# sourceMappingURL=auth-dog.guard.js.map