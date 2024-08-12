"use strict";
Object.defineProperty(exports, "CookieInterceptor", {
    enumerable: true,
    get: function() {
        return CookieInterceptor;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _rxjs = require("rxjs");
const _winstonLoggerservice = require("../../common/logger/winstonLogger.service");
const _tokenservice = require("../token/token.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CookieInterceptor = class CookieInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, _rxjs.map)((data)=>{
            const response = context.switchToHttp().getResponse();
            if (!data) {
                this.clearAuthCookies(response);
                return;
            }
            if ('accessToken' in data && 'refreshToken' in data) {
                this.setAuthCookies(response, data);
                this.clearOauthCookies(response);
                return {
                    accessToken: data.accessToken
                };
            } else if ('oauthAccessToken' in data && 'oauthRefreshToken' in data && 'provider' in data) {
                this.setOauthCookies(response, data);
                const error = new _common.NotFoundException('일치하는 유저를 찾을 수 없습니다. 계정을 생성해주세요');
                var _error_stack;
                this.logger.error(`일치하는 유저를 찾을 수 없습니다. 계정을 생성해주세요`, (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음');
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
    constructor(configService, logger){
        this.configService = configService;
        this.logger = logger;
        this.isProduction = this.configService.get('NODE_ENV') === 'prod';
        this.sessionCookieOptions = {
            httpOnly: true,
            secure: this.isProduction,
            sameSite: 'lax'
        };
        this.refreshCookieOptions = {
            ...this.sessionCookieOptions,
            maxAge: _tokenservice.TokenService.TOKEN_LIFETIME_MAP.refresh.maxAge
        };
    }
};
CookieInterceptor = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], CookieInterceptor);

//# sourceMappingURL=cookie.interceptor.js.map