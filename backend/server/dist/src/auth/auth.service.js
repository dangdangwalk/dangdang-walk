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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_transactional_1 = require("typeorm-transactional");
const google_service_1 = require("./oauth/google.service");
const kakao_service_1 = require("./oauth/kakao.service");
const naver_service_1 = require("./oauth/naver.service");
const token_service_1 = require("./token/token.service");
const winstonLogger_service_1 = require("../common/logger/winstonLogger.service");
const dogs_service_1 = require("../dogs/dogs.service");
const s3_service_1 = require("../s3/s3.service");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(tokenService, usersService, dogsService, googleService, kakaoService, naverService, configService, s3Service, logger) {
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
    async login({ authorizeCode, provider }) {
        const { access_token: oauthAccessToken, refresh_token: oauthRefreshToken } = await this[`${provider}Service`].requestToken(authorizeCode, this.REDIRECT_URI);
        const { oauthId } = await this[`${provider}Service`].requestUserInfo(oauthAccessToken);
        const refreshToken = await this.tokenService.signRefreshToken(oauthId, provider);
        this.logger.debug('login - signRefreshToken', { refreshToken });
        try {
            const { id: userId } = await this.usersService.updateAndFindOne({ oauthId }, { oauthAccessToken, oauthRefreshToken, refreshToken });
            const accessToken = await this.tokenService.signAccessToken(userId, provider);
            this.logger.debug('login - signAccessToken', { accessToken });
            return { accessToken, refreshToken };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return { oauthAccessToken, oauthRefreshToken, provider };
            }
            this.logger.error(`로그인 에러`, { trace: error.stack ?? '스택 없음' });
            throw error;
        }
    }
    async signup({ oauthAccessToken, oauthRefreshToken, provider }) {
        const { oauthId, oauthNickname, email } = await this[`${provider}Service`].requestUserInfo(oauthAccessToken);
        const profileImageUrl = this.S3_PROFILE_IMAGE_PATH;
        const refreshToken = await this.tokenService.signRefreshToken(oauthId, provider);
        this.logger.debug('signup - signRefreshToken', { refreshToken });
        const { id: userId } = await this.usersService.createIfNotExists({
            oauthNickname,
            email,
            profileImageUrl,
            oauthId,
            oauthAccessToken,
            oauthRefreshToken,
            refreshToken,
        });
        const accessToken = await this.tokenService.signAccessToken(userId, provider);
        this.logger.debug('signup - signAccessToken', { accessToken });
        return { accessToken, refreshToken };
    }
    async logout({ userId, provider }) {
        const { oauthAccessToken } = await this.usersService.findOne({ where: { id: userId } });
        this.logger.debug('logout - oauthAccessToken', { oauthAccessToken });
        if (provider === 'kakao') {
            await this.kakaoService.requestTokenExpiration(oauthAccessToken);
        }
    }
    async reissueTokens({ oauthId, provider }) {
        const { id: userId, oauthRefreshToken } = await this.usersService.findOne({
            where: { oauthId },
            select: ['id', 'oauthRefreshToken'],
        });
        const [{ access_token: newOauthAccessToken, refresh_token: newOauthRefreshToken }, newAccessToken, newRefreshToken,] = await Promise.all([
            this[`${provider}Service`].requestTokenRefresh(oauthRefreshToken),
            this.tokenService.signAccessToken(userId, provider),
            this.tokenService.signRefreshToken(oauthId, provider),
        ]);
        const attributes = { oauthAccessToken: newOauthAccessToken, refreshToken: newRefreshToken };
        if (newOauthRefreshToken) {
            attributes.oauthRefreshToken = newOauthRefreshToken;
        }
        this.usersService.update({ id: userId }, attributes);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    async deactivate({ userId, provider }) {
        const { oauthAccessToken } = await this.usersService.findOne({ where: { id: userId } });
        if (provider === 'kakao') {
            await this.kakaoService.requestUnlink(oauthAccessToken);
        }
        else {
            await this[`${provider}Service`].requestTokenExpiration(oauthAccessToken);
        }
        await this.deleteUserData(userId);
    }
    async deleteUserData(userId) {
        await this.dogsService.deleteOwnDogs(userId);
        await this.usersService.delete(userId);
    }
    async validateAccessToken(token) {
        const payload = (await this.tokenService.verify(token));
        this.logger.log('Payload', payload);
        const result = await this.usersService.findOne({ where: { id: payload.userId } });
        this.logger.debug('validateAccessToken - find User result', { ...result });
        return payload;
    }
    async validateRefreshToken(token) {
        const payload = (await this.tokenService.verify(token));
        this.logger.log('Payload', payload);
        const { refreshToken } = await this.usersService.findOne({ where: { oauthId: payload.oauthId } });
        if (refreshToken !== token) {
            throw new common_1.UnauthorizedException();
        }
        return payload;
    }
};
exports.AuthService = AuthService;
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "deleteUserData", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [token_service_1.TokenService,
        users_service_1.UsersService,
        dogs_service_1.DogsService,
        google_service_1.GoogleService,
        kakao_service_1.KakaoService,
        naver_service_1.NaverService,
        config_1.ConfigService,
        s3_service_1.S3Service,
        winstonLogger_service_1.WinstonLoggerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map