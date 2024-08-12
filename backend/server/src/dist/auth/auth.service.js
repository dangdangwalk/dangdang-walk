"use strict";
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _typeormtransactional = require("typeorm-transactional");
const _googleservice = require("./oauth/google.service");
const _kakaoservice = require("./oauth/kakao.service");
const _naverservice = require("./oauth/naver.service");
const _tokenservice = require("./token/token.service");
const _winstonLoggerservice = require("../common/logger/winstonLogger.service");
const _dogsservice = require("../dogs/dogs.service");
const _s3service = require("../s3/s3.service");
const _usersservice = require("../users/users.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthService = class AuthService {
    async login({ authorizeCode, provider }) {
        const { access_token: oauthAccessToken, refresh_token: oauthRefreshToken } = await this[`${provider}Service`].requestToken(authorizeCode, this.REDIRECT_URI);
        const { oauthId } = await this[`${provider}Service`].requestUserInfo(oauthAccessToken);
        const refreshToken = await this.tokenService.signRefreshToken(oauthId, provider);
        this.logger.debug('login - signRefreshToken', {
            refreshToken
        });
        try {
            const { id: userId } = await this.usersService.updateAndFindOne({
                oauthId
            }, {
                oauthAccessToken,
                oauthRefreshToken,
                refreshToken
            });
            const accessToken = await this.tokenService.signAccessToken(userId, provider);
            this.logger.debug('login - signAccessToken', {
                accessToken
            });
            return {
                accessToken,
                refreshToken
            };
        } catch (error) {
            if (error instanceof _common.NotFoundException) {
                return {
                    oauthAccessToken,
                    oauthRefreshToken,
                    provider
                };
            }
            var _error_stack;
            this.logger.error(`로그인 에러`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음'
            });
            throw error;
        }
    }
    async signup({ oauthAccessToken, oauthRefreshToken, provider }) {
        const { oauthId, oauthNickname, email } = await this[`${provider}Service`].requestUserInfo(oauthAccessToken);
        const profileImageUrl = this.S3_PROFILE_IMAGE_PATH;
        const refreshToken = await this.tokenService.signRefreshToken(oauthId, provider);
        this.logger.debug('signup - signRefreshToken', {
            refreshToken
        });
        const { id: userId } = await this.usersService.createIfNotExists({
            oauthNickname,
            email,
            profileImageUrl,
            oauthId,
            oauthAccessToken,
            oauthRefreshToken,
            refreshToken
        });
        const accessToken = await this.tokenService.signAccessToken(userId, provider);
        this.logger.debug('signup - signAccessToken', {
            accessToken
        });
        return {
            accessToken,
            refreshToken
        };
    }
    async logout({ userId, provider }) {
        const { oauthAccessToken } = await this.usersService.findOne({
            where: {
                id: userId
            }
        });
        this.logger.debug('logout - oauthAccessToken', {
            oauthAccessToken
        });
        if (provider === 'kakao') {
            await this.kakaoService.requestTokenExpiration(oauthAccessToken);
        }
    }
    async reissueTokens({ oauthId, provider }) {
        const { id: userId, oauthRefreshToken } = await this.usersService.findOne({
            where: {
                oauthId
            },
            select: [
                'id',
                'oauthRefreshToken'
            ]
        });
        const [{ access_token: newOauthAccessToken, refresh_token: newOauthRefreshToken }, newAccessToken, newRefreshToken] = await Promise.all([
            this[`${provider}Service`].requestTokenRefresh(oauthRefreshToken),
            this.tokenService.signAccessToken(userId, provider),
            this.tokenService.signRefreshToken(oauthId, provider)
        ]);
        const attributes = {
            oauthAccessToken: newOauthAccessToken,
            refreshToken: newRefreshToken
        };
        if (newOauthRefreshToken) {
            attributes.oauthRefreshToken = newOauthRefreshToken;
        }
        this.usersService.update({
            id: userId
        }, attributes);
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
    async deactivate({ userId, provider }) {
        const { oauthAccessToken } = await this.usersService.findOne({
            where: {
                id: userId
            }
        });
        if (provider === 'kakao') {
            await this.kakaoService.requestUnlink(oauthAccessToken);
        } else {
            await this[`${provider}Service`].requestTokenExpiration(oauthAccessToken);
        }
        await this.deleteUserData(userId);
    }
    async deleteUserData(userId) {
        await this.dogsService.deleteOwnDogs(userId);
        await this.usersService.delete(userId);
    }
    async validateAccessToken(token) {
        const payload = await this.tokenService.verify(token);
        this.logger.log('Payload', payload);
        const result = await this.usersService.findOne({
            where: {
                id: payload.userId
            }
        });
        this.logger.debug('validateAccessToken - find User result', {
            ...result
        });
        return payload;
    }
    async validateRefreshToken(token) {
        const payload = await this.tokenService.verify(token);
        this.logger.log('Payload', payload);
        const { refreshToken } = await this.usersService.findOne({
            where: {
                oauthId: payload.oauthId
            }
        });
        if (refreshToken !== token) {
            throw new _common.UnauthorizedException();
        }
        return payload;
    }
    constructor(tokenService, usersService, dogsService, googleService, kakaoService, naverService, configService, s3Service, logger){
        this.tokenService = tokenService;
        this.usersService = usersService;
        this.dogsService = dogsService;
        this.googleService = googleService;
        this.kakaoService = kakaoService;
        this.naverService = naverService;
        this.configService = configService;
        this.s3Service = s3Service;
        this.logger = logger;
        this.REDIRECT_URI = this.configService.get('CORS_ORIGIN') + '/callback';
        this.S3_PROFILE_IMAGE_PATH = 'default/profile.png';
    }
};
_ts_decorate([
    (0, _typeormtransactional.Transactional)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthService.prototype, "deleteUserData", null);
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.TokenService === "undefined" ? Object : _tokenservice.TokenService,
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _dogsservice.DogsService === "undefined" ? Object : _dogsservice.DogsService,
        typeof _googleservice.GoogleService === "undefined" ? Object : _googleservice.GoogleService,
        typeof _kakaoservice.KakaoService === "undefined" ? Object : _kakaoservice.KakaoService,
        typeof _naverservice.NaverService === "undefined" ? Object : _naverservice.NaverService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _s3service.S3Service === "undefined" ? Object : _s3service.S3Service,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map