"use strict";
Object.defineProperty(exports, "OauthDataGuard", {
    enumerable: true,
    get: function() {
        return OauthDataGuard;
    }
});
const _common = require("@nestjs/common");
const _winstonLoggerservice = require("../../common/logger/winstonLogger.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OauthDataGuard = class OauthDataGuard {
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
                !provider && 'provider'
            ].filter(Boolean).join(', ');
            const error = new _common.UnauthorizedException(`쿠키에 OAuth 데이터가 없습니다: ${missingFields}`);
            var _error_stack;
            this.logger.error(`OAuthDataGuard : ${missingFields} 필드가 없습니다`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음'
            });
            throw error;
        }
        return {
            oauthAccessToken,
            oauthRefreshToken,
            provider
        };
    }
    constructor(logger){
        this.logger = logger;
    }
};
OauthDataGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], OauthDataGuard);

//# sourceMappingURL=oauth-data.guard.js.map