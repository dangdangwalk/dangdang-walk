"use strict";
Object.defineProperty(exports, "NaverService", {
    enumerable: true,
    get: function() {
        return NaverService;
    }
});
const _axios = require("@nestjs/axios");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _axios1 = require("axios");
const _rxjs = require("rxjs");
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
let NaverService = class NaverService {
    async requestToken(authorizeCode) {
        try {
            const { data } = await (0, _rxjs.firstValueFrom)(this.httpService.get(this.TOKEN_API, {
                params: {
                    grant_type: 'authorization_code',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    code: authorizeCode,
                    state: 'naverLoginState'
                }
            }));
            return data;
        } catch (error) {
            if (_axios1.default.isAxiosError(error) && error.response) {
                var _error_stack;
                this.logger.error('Naver: Token 발급 요청이 실패했습니다', {
                    trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : 'No stack',
                    response: error.response.data
                });
                error = new _common.BadRequestException('Naver: Token 발급 요청이 실패했습니다');
            }
            throw error;
        }
    }
    async requestUserInfo(accessToken) {
        try {
            const { data } = await (0, _rxjs.firstValueFrom)(this.httpService.get(this.USER_INFO_API, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }));
            this.logger.log('requestUserInfo', {
                ...data
            });
            return {
                oauthId: data.response.id,
                oauthNickname: data.response.nickname,
                email: data.response.email,
                profileImageUrl: data.response.profile_image
            };
        } catch (error) {
            if (_axios1.default.isAxiosError(error) && error.response) {
                var _error_stack;
                this.logger.error('Naver: 유저 정보 조회 요청이 실패했습니다', {
                    trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : 'No stack',
                    response: error.response.data
                });
                error = new _common.BadRequestException('Naver: 유저 정보 조회 요청이 실패했습니다');
            }
            throw error;
        }
    }
    async requestTokenExpiration(accessToken) {
        try {
            await (0, _rxjs.firstValueFrom)(this.httpService.get(this.TOKEN_API, {
                params: {
                    grant_type: 'delete',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    access_token: accessToken,
                    service_provider: 'NAVER'
                }
            }));
        } catch (error) {
            if (_axios1.default.isAxiosError(error) && error.response) {
                var _error_stack;
                this.logger.error('Naver: Token 만료 기간 조회 요청이 실패했습니다', {
                    trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : 'No stack',
                    response: error.response.data
                });
                error = new _common.BadRequestException('Naver: Token 만료 기간 조회 요청이 실패했습니다');
            }
            throw error;
        }
    }
    async requestTokenRefresh(refreshToken) {
        try {
            const { data } = await (0, _rxjs.firstValueFrom)(this.httpService.get(this.TOKEN_API, {
                params: {
                    grant_type: 'refresh_token',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    refresh_token: refreshToken
                }
            }));
            return data;
        } catch (error) {
            if (_axios1.default.isAxiosError(error) && error.response) {
                var _error_stack;
                this.logger.error('Naver: Token 갱신 요청이 실패했습니다', {
                    trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : 'No stack',
                    response: error.response.data
                });
                error = new _common.BadRequestException('Naver: Token 갱신 요청이 실패했습니다');
            }
            throw error;
        }
    }
    constructor(configService, httpService, logger){
        this.configService = configService;
        this.httpService = httpService;
        this.logger = logger;
        this.CLIENT_ID = this.configService.get('NAVER_CLIENT_ID');
        this.CLIENT_SECRET = this.configService.get('NAVER_CLIENT_SECRET');
        this.TOKEN_API = this.configService.get('NAVER_TOKEN_API');
        this.USER_INFO_API = this.configService.get('NAVER_USER_INFO_API');
    }
};
NaverService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], NaverService);

//# sourceMappingURL=naver.service.js.map