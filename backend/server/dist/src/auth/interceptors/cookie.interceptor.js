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
exports.CookieInterceptor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const winstonLogger_service_1 = require("../../common/logger/winstonLogger.service");
const token_service_1 = require("../token/token.service");
let CookieInterceptor = class CookieInterceptor {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.isProduction = this.configService.get('NODE_ENV') === 'prod';
        this.sessionCookieOptions = {
            httpOnly: true,
            secure: this.isProduction,
            sameSite: 'lax',
        };
        this.refreshCookieOptions = {
            ...this.sessionCookieOptions,
            maxAge: token_service_1.TokenService.TOKEN_LIFETIME_MAP.refresh.maxAge,
        };
    }
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            const response = context.switchToHttp().getResponse();
            if (!data) {
                this.clearAuthCookies(response);
                return;
            }
            if ('accessToken' in data && 'refreshToken' in data) {
                this.setAuthCookies(response, data);
                this.clearOauthCookies(response);
                return { accessToken: data.accessToken };
            }
            else if ('oauthAccessToken' in data && 'oauthRefreshToken' in data && 'provider' in data) {
                this.setOauthCookies(response, data);
                const error = new common_1.NotFoundException('일치하는 유저를 찾을 수 없습니다. 계정을 생성해주세요');
                this.logger.error(`일치하는 유저를 찾을 수 없습니다. 계정을 생성해주세요`, error.stack ?? '스택 없음');
                throw error;
            }
        }));
    }
    setAuthCookies(response, { refreshToken }) {
        response.cookie('refreshToken', refreshToken, this.refreshCookieOptions);
    }
    setOauthCookies(response, { oauthAccessToken, oauthRefreshToken, provider }) {
        response.cookie('oauthAccessToken', oauthAccessToken, this.sessionCookieOptions);
        response.cookie('oauthRefreshToken', oauthRefreshToken, this.sessionCookieOptions);
        response.cookie('provider', provider, this.sessionCookieOptions);
    }
    clearAuthCookies(response) {
        response.clearCookie('refreshToken', this.refreshCookieOptions);
    }
    clearOauthCookies(response) {
        response.clearCookie('oauthAccessToken', this.sessionCookieOptions);
        response.clearCookie('oauthRefreshToken', this.sessionCookieOptions);
        response.clearCookie('provider', this.sessionCookieOptions);
    }
};
exports.CookieInterceptor = CookieInterceptor;
exports.CookieInterceptor = CookieInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        winstonLogger_service_1.WinstonLoggerService])
], CookieInterceptor);
//# sourceMappingURL=cookie.interceptor.js.map