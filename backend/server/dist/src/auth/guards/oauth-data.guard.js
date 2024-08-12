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
exports.OauthDataGuard = void 0;
const common_1 = require("@nestjs/common");
const winstonLogger_service_1 = require("../../common/logger/winstonLogger.service");
let OauthDataGuard = class OauthDataGuard {
    constructor(logger) {
        this.logger = logger;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const oauthData = this.extractOauthDataFromCookies(request);
        request.oauthData = oauthData;
        return true;
    }
    extractOauthDataFromCookies(request) {
        const oauthAccessToken = request.cookies['oauthAccessToken'];
        const oauthRefreshToken = request.cookies['oauthRefreshToken'];
        const provider = request.cookies['provider'];
        if (!oauthAccessToken || !oauthRefreshToken || !provider) {
            const missingFields = [
                !oauthAccessToken && 'oauthAccessToken',
                !oauthRefreshToken && 'oauthRefreshToken',
                !provider && 'provider',
            ]
                .filter(Boolean)
                .join(', ');
            const error = new common_1.UnauthorizedException(`쿠키에 OAuth 데이터가 없습니다: ${missingFields}`);
            this.logger.error(`OAuthDataGuard : ${missingFields} 필드가 없습니다`, {
                trace: error.stack ?? '스택 없음',
            });
            throw error;
        }
        return { oauthAccessToken, oauthRefreshToken, provider };
    }
};
exports.OauthDataGuard = OauthDataGuard;
exports.OauthDataGuard = OauthDataGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [winstonLogger_service_1.WinstonLoggerService])
], OauthDataGuard);
//# sourceMappingURL=oauth-data.guard.js.map