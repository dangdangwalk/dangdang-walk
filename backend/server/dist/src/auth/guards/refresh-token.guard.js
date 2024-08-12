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
exports.RefreshTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const winstonLogger_service_1 = require("../../common/logger/winstonLogger.service");
const auth_service_1 = require("../auth.service");
let RefreshTokenGuard = class RefreshTokenGuard {
    constructor(authService, logger) {
        this.authService = authService;
        this.logger = logger;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractRefreshTokenFromCookie(request);
        try {
            request.user = await this.authService.validateRefreshToken(token);
            return true;
        }
        catch (error) {
            if (error instanceof jwt_1.TokenExpiredError || error instanceof jwt_1.JsonWebTokenError) {
                const trace = { trace: error.stack ?? 'No stack' };
                error = new common_1.UnauthorizedException(error.message);
                this.logger.error(error.message, trace);
                throw error;
            }
            else {
                error = new common_1.UnauthorizedException();
                this.logger.error(error.message, { trace: error.stack ?? 'No stack' });
                throw error;
            }
        }
    }
    extractRefreshTokenFromCookie(request) {
        const token = request.cookies['refreshToken'];
        if (!token) {
            const error = new common_1.UnauthorizedException('쿠키에 refreshToken이 없습니다');
            this.logger.error(`쿠키에 refreshToken이 없습니다`, { trace: error.stack ?? '스택 없음' });
            throw error;
        }
        return token;
    }
};
exports.RefreshTokenGuard = RefreshTokenGuard;
exports.RefreshTokenGuard = RefreshTokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        winstonLogger_service_1.WinstonLoggerService])
], RefreshTokenGuard);
//# sourceMappingURL=refresh-token.guard.js.map