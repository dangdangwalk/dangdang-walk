import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transactional } from 'typeorm-transactional';

import { KakaoService } from './oauth/kakao.service';
import { OauthService } from './oauth/oauth.service.interface';
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from './token/token.service';
import { AuthData } from './types/auth-data.type';
import { OauthAuthorizeData } from './types/oauth-authorize-data.type';
import { OauthData } from './types/oauth-data.type';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogsService } from '../dogs/dogs.service';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService,
        @Inject('OAUTH_SERVICES')
        private readonly oauthServices: Map<string, OauthService>,
        private readonly configService: ConfigService,
        private readonly logger: WinstonLoggerService,
    ) {}

    private readonly REDIRECT_URI = this.configService.get<string>('CORS_ORIGIN') + '/callback';
    private readonly S3_PROFILE_IMAGE_PATH = 'default/profile.png';

    private getOauthService(provider: string): OauthService {
        const oauthService = this.oauthServices.get(provider);
        if (!oauthService) throw new Error(`Unknown provider: ${provider}`);
        return oauthService;
    }

    async login({ authorizeCode, provider }: OauthAuthorizeData): Promise<AuthData | OauthData | undefined> {
        const oauthService = this.getOauthService(provider);

        const { access_token: oauthAccessToken, refresh_token: oauthRefreshToken } = await oauthService.requestToken(
            authorizeCode,
            this.REDIRECT_URI,
        );

        const { oauthId } = await oauthService.requestUserInfo(oauthAccessToken);

        const refreshToken = await this.tokenService.signRefreshToken(oauthId, provider);
        this.logger.debug('login - signRefreshToken', { refreshToken });

        try {
            const { id: userId } = await this.usersService.updateAndFindOne(
                { oauthId },
                { oauthAccessToken, oauthRefreshToken, refreshToken },
            );

            const accessToken = await this.tokenService.signAccessToken(userId, provider);
            this.logger.debug('login - signAccessToken', { accessToken });

            return { accessToken, refreshToken };
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { oauthAccessToken, oauthRefreshToken, provider };
            }
            this.logger.error(`로그인 에러`, { trace: error.stack ?? '스택 없음' });
            throw error;
        }
    }

    async signup({ oauthAccessToken, oauthRefreshToken, provider }: OauthData): Promise<AuthData> {
        const oauthService = this.getOauthService(provider);

        const { oauthId, oauthNickname, email } = await oauthService.requestUserInfo(oauthAccessToken);
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

    async logout({ userId, provider }: AccessTokenPayload): Promise<void> {
        const oauthService = this.getOauthService(provider);

        const { oauthAccessToken } = await this.usersService.findOne({ where: { id: userId } });
        this.logger.debug('logout - oauthAccessToken', { oauthAccessToken });

        if (provider === 'kakao') {
            await (oauthService as KakaoService).requestTokenExpiration(oauthAccessToken);
        }
    }

    async reissueTokens({ oauthId, provider }: RefreshTokenPayload): Promise<AuthData> {
        const oauthService = this.getOauthService(provider);

        const { id: userId, oauthRefreshToken } = await this.usersService.findOne({
            where: { oauthId },
            select: ['id', 'oauthRefreshToken'],
        });

        const [
            { access_token: newOauthAccessToken, refresh_token: newOauthRefreshToken },
            newAccessToken,
            newRefreshToken,
        ] = await Promise.all([
            oauthService.requestTokenRefresh(oauthRefreshToken),
            this.tokenService.signAccessToken(userId, provider),
            this.tokenService.signRefreshToken(oauthId, provider),
        ]);

        const attributes: Partial<Users> = { oauthAccessToken: newOauthAccessToken, refreshToken: newRefreshToken };

        if (newOauthRefreshToken) {
            attributes.oauthRefreshToken = newOauthRefreshToken;
        }

        this.usersService.update({ id: userId }, attributes);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async deactivate({ userId, provider }: AccessTokenPayload): Promise<void> {
        const oauthService = this.getOauthService(provider);

        const { oauthAccessToken } = await this.usersService.findOne({ where: { id: userId } });

        if (provider === 'kakao') {
            await (oauthService as KakaoService).requestUnlink(oauthAccessToken);
        } else {
            await oauthService.requestTokenExpiration(oauthAccessToken);
        }

        await this.deleteUserData(userId);
    }

    @Transactional()
    private async deleteUserData(userId: number) {
        await this.dogsService.deleteOwnDogs(userId);
        await this.usersService.delete(userId);
    }

    async validateAccessToken(token: string): Promise<AccessTokenPayload> {
        const payload = (await this.tokenService.verify(token)) as AccessTokenPayload;
        this.logger.log('Payload', payload);

        const result = await this.usersService.findOne({ where: { id: payload.userId } });
        this.logger.debug('validateAccessToken - find User result', { ...result });

        return payload;
    }

    async validateRefreshToken(token: string): Promise<RefreshTokenPayload> {
        const payload = (await this.tokenService.verify(token)) as RefreshTokenPayload;
        this.logger.log('Payload', payload);

        const { refreshToken } = await this.usersService.findOne({ where: { oauthId: payload.oauthId } });

        if (refreshToken !== token) {
            throw new UnauthorizedException();
        }

        return payload;
    }
}
