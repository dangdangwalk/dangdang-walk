import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transactional } from 'typeorm-transactional';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogsService } from '../dogs/dogs.service';
import { S3Service } from '../s3/s3.service';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { GoogleService } from './oauth/google.service';
import { KakaoService } from './oauth/kakao.service';
import { NaverService } from './oauth/naver.service';
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from './token/token.service';
import { AuthData } from './types/auth-data.type';
import { OauthAuthorizeData } from './types/oauth-authorize-data.type';
import { OauthData } from './types/oauth-data.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService,
        private readonly googleService: GoogleService,
        private readonly kakaoService: KakaoService,
        private readonly naverService: NaverService,
        private readonly configService: ConfigService,
        private readonly s3Service: S3Service,
        private readonly logger: WinstonLoggerService,
    ) {}

    private readonly redirectURI = this.configService.get<string>('CORS_ORIGIN') + '/callback';

    async login({ authorizeCode, provider }: OauthAuthorizeData): Promise<AuthData | OauthData | undefined> {
        const { access_token: oauthAccessToken, refresh_token: oauthRefreshToken } = await this[
            `${provider}Service`
        ].requestToken(authorizeCode, this.redirectURI);

        const { oauthId } = await this[`${provider}Service`].requestUserInfo(oauthAccessToken);

        const refreshToken = this.tokenService.signRefreshToken(oauthId, provider);
        this.logger.debug('login - signRefreshToken', { refreshToken });

        try {
            const { id: userId } = await this.usersService.updateAndFindOne(
                { oauthId },
                { oauthAccessToken, oauthRefreshToken, refreshToken },
            );

            const accessToken = this.tokenService.signAccessToken(userId, provider);
            this.logger.debug('login - signAccessToken', { accessToken });

            return { accessToken, refreshToken };
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { oauthAccessToken, oauthRefreshToken, provider };
            }
            this.logger.error(`Login error`, { trace: error.stack ?? 'No stack' });
            throw error;
        }
    }

    async signup({ oauthAccessToken, oauthRefreshToken, provider }: OauthData): Promise<AuthData> {
        const { oauthId, oauthNickname, email, profileImageUrl } =
            await this[`${provider}Service`].requestUserInfo(oauthAccessToken);

        const refreshToken = this.tokenService.signRefreshToken(oauthId, provider);
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

        const accessToken = this.tokenService.signAccessToken(userId, provider);
        this.logger.debug('signup - signAccessToken', { accessToken });

        return { accessToken, refreshToken };
    }

    async logout({ userId, provider }: AccessTokenPayload): Promise<void> {
        const { oauthAccessToken } = await this.usersService.findOne({ id: userId });
        this.logger.debug('logout - oauthAccessToken', { oauthAccessToken });

        if (provider === 'kakao') {
            await this.kakaoService.requestTokenExpiration(oauthAccessToken);
        }
    }

    async reissueTokens({ oauthId, provider }: RefreshTokenPayload): Promise<AuthData> {
        const { id: userId, oauthRefreshToken } = await this.usersService.findOne({ oauthId });

        const { access_token: newOauthAccessToken, refresh_token: newOauthRefreshToken } =
            await this[`${provider}Service`].requestTokenRefresh(oauthRefreshToken);

        const newAccessToken = this.tokenService.signAccessToken(userId, provider);
        const newRefreshToken = this.tokenService.signRefreshToken(oauthId, provider);

        const attr: Partial<Users> = { oauthAccessToken: newOauthAccessToken, refreshToken: newRefreshToken };

        if (newOauthRefreshToken) {
            attr.oauthRefreshToken = newOauthRefreshToken;
        }

        this.usersService.update({ id: userId }, attr);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async deactivate({ userId, provider }: AccessTokenPayload): Promise<void> {
        const { oauthAccessToken } = await this.usersService.findOne({ id: userId });

        if (provider === 'kakao') {
            await this.kakaoService.requestUnlink(oauthAccessToken);
        } else {
            await this[`${provider}Service`].requestTokenExpiration(oauthAccessToken);
        }

        await this.deleteUserData(userId);
    }

    @Transactional()
    private async deleteUserData(userId: number) {
        const dogIds = await this.usersService.getOwnDogsList(userId);
        dogIds.forEach(async (dogId) => {
            await this.dogsService.deleteDogFromUser(userId, dogId);
        });

        await this.usersService.delete({ id: userId });
        await this.s3Service.deleteObjectFolder(userId);
    }

    async validateAccessToken(userId: number) {
        const result = await this.usersService.findOne({ id: userId });
        this.logger.debug('validateAccessToken - find User result', { ...result });
    }

    async validateRefreshToken(token: string, oauthId: string) {
        const { refreshToken } = await this.usersService.findOne({ oauthId });

        if (refreshToken !== token) {
            throw new UnauthorizedException();
        }
    }
}
