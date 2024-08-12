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
exports.KakaoService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_2 = require("axios");
const rxjs_1 = require("rxjs");
const winstonLogger_service_1 = require("../../common/logger/winstonLogger.service");
let KakaoService = class KakaoService {
    constructor(configService, httpService, logger) {
        this.configService = configService;
        this.httpService = httpService;
        this.logger = logger;
        this.CLIENT_ID = this.configService.get('KAKAO_CLIENT_ID');
        this.CLIENT_SECRET = this.configService.get('KAKAO_CLIENT_SECRET');
        this.TOKEN_API = this.configService.get('KAKAO_TOKEN_API');
        this.USER_INFO_API = this.configService.get('KAKAO_USER_INFO_API');
        this.LOGOUT_API = this.configService.get('KAKAO_LOGOUT_API');
        this.UNLINK_API = this.configService.get('KAKAO_UNLINK_API');
    }
    async requestToken(authorizeCode, redirectURI) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.TOKEN_API, {
                code: authorizeCode,
                grant_type: 'authorization_code',
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                redirect_uri: redirectURI,
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            }));
            return data;
        }
        catch (error) {
            if (axios_2.default.isAxiosError(error) && error.response) {
                this.logger.error(`Kakao: Token 발급 요청이 실패했습니다`, {
                    trace: error.stack ?? '스택 없음',
                    response: error.response.data,
                });
                error = new common_1.BadRequestException('Kakao: Token 발급 요청이 실패했습니다');
            }
            throw error;
        }
    }
    async requestUserInfo(accessToken) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.USER_INFO_API, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }));
            this.logger.log('requestUserInfo', { ...data });
            return {
                oauthId: data.id.toString(),
                oauthNickname: data.properties.nickname,
                email: data.kakao_account.email,
                profileImageUrl: data.properties.profile_image,
            };
        }
        catch (error) {
            if (axios_2.default.isAxiosError(error) && error.response) {
                this.logger.error('Kakao: 유저 정보 조회 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new common_1.BadRequestException('Kakao: 유저 정보 조회 요청이 실패했습니다');
            }
            throw error;
        }
    }
    async requestTokenExpiration(accessToken) {
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.LOGOUT_API, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }));
        }
        catch (error) {
            if (axios_2.default.isAxiosError(error) && error.response) {
                this.logger.error('Kakao: Token 만료 기간 조회 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new common_1.BadRequestException('Kakao: Token 만료 기간 조회 요청이 실패했습니다');
            }
            throw error;
        }
    }
    async requestUnlink(accessToken) {
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.UNLINK_API, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }));
        }
        catch (error) {
            if (axios_2.default.isAxiosError(error) && error.response) {
                this.logger.error('Kakao: 계정 연결 끊기 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new common_1.BadRequestException('Kakao: 계정 연결 끊기 요청이 실패했습니다');
            }
            throw error;
        }
    }
    async requestTokenRefresh(refreshToken) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.TOKEN_API, {
                grant_type: 'refresh_token',
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                refresh_token: refreshToken,
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            }));
            return data;
        }
        catch (error) {
            if (axios_2.default.isAxiosError(error) && error.response) {
                this.logger.error('Kakao: Token 갱신 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new common_1.BadRequestException('Kakao: Token 갱신 요청이 실패했습니다');
            }
            throw error;
        }
    }
};
exports.KakaoService = KakaoService;
exports.KakaoService = KakaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService,
        winstonLogger_service_1.WinstonLoggerService])
], KakaoService);
//# sourceMappingURL=kakao.service.js.map