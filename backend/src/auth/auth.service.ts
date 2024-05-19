import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { DogsService } from 'src/dogs/dogs.service';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { OauthBody, OauthProvider } from './auth.controller';
import { GoogleService } from './oauth/google.service';
import { KakaoService } from './oauth/kakao.service';
import { NaverService } from './oauth/naver.service';
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from './token/token.service';

export interface AuthData {
    accessToken: string;
    refreshToken: string;
}

export interface OauthData {
    oauthAccessToken: string;
    oauthRefreshToken: string;
    oauthId: string;
    provider: OauthProvider;
}

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
        private readonly logger: WinstonLoggerService
    ) {}

    private readonly redirectURI = this.configService.get<string>('CORS_ORIGIN') + '/callback';

    async login({ authorizeCode, provider }: OauthBody): Promise<AuthData | OauthData | undefined> {
        const { oauthAccessToken, oauthRefreshToken, oauthId } = await this.getOauthData(authorizeCode, provider);

        const refreshToken = this.tokenService.signRefreshToken(oauthId, provider);
        this.logger.debug(`login - signRefreshToken: ${refreshToken}`);

        try {
            const { id: userId } = await this.usersService.updateAndFindOne(
                { oauthId },
                { oauthAccessToken, oauthRefreshToken, refreshToken }
            );

            const accessToken = this.tokenService.signAccessToken(userId, provider);
            this.logger.debug(`login - signAccessToken: ${accessToken}`);

            return { accessToken, refreshToken };
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { oauthAccessToken, oauthRefreshToken, oauthId, provider };
            }
            this.logger.error(`Login error`, error.stack ?? 'No stack');
            throw error;
        }
    }

    async signup({ oauthAccessToken, oauthRefreshToken, oauthId, provider }: OauthData): Promise<AuthData> {
        const refreshToken = this.tokenService.signRefreshToken(oauthId, provider);
        this.logger.debug(`signup - signRefreshToken: ${refreshToken}`);

        const { id: userId } = await this.usersService.createIfNotExists(
            oauthId,
            oauthAccessToken,
            oauthRefreshToken,
            refreshToken
        );

        const accessToken = this.tokenService.signAccessToken(userId, provider);
        this.logger.debug(`signup - signAccessToken: ${accessToken}`);

        return { accessToken, refreshToken };
    }

    async logout({ userId, provider }: AccessTokenPayload): Promise<void> {
        const { oauthAccessToken } = await this.usersService.findOne({ id: userId });
        this.logger.debug(`logout - oauthAccessToken: ${oauthAccessToken}`);

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

        if (newOauthRefreshToken) attr.oauthRefreshToken = newOauthRefreshToken;

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

    private async deleteUserData(userId: number) {
        const dogIds = await this.usersService.getOwnDogsList(userId);
        dogIds.forEach(async (dogId) => {
            await this.dogsService.deleteDogFromUser(dogId);
        });

        await this.usersService.delete({ id: userId });
    }

    private async getOauthData(authorizeCode: string, provider: OauthProvider): Promise<Omit<OauthData, 'provider'>> {
        const { access_token: oauthAccessToken, refresh_token: oauthRefreshToken } = await this[
            `${provider}Service`
        ].requestToken(authorizeCode, this.redirectURI);

        const oauthId = await this[`${provider}Service`].requestUserId(oauthAccessToken);

        return { oauthAccessToken, oauthRefreshToken, oauthId };
    }

    async validateAccessToken(userId: number): Promise<boolean> {
        try {
            const result = await this.usersService.findOne({ id: userId });
            this.logger.debug(`validateAccessToken - find User result:\n${JSON.stringify(result, null, 2)}`);

            return true;
        } catch {
            return false;
        }
    }

    async validateRefreshToken(token: string, oauthId: string): Promise<boolean> {
        const { refreshToken } = await this.usersService.findOne({ oauthId });

        return refreshToken === token;
    }
}
