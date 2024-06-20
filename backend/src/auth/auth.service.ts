import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transactional } from 'typeorm-transactional';

import { GoogleService } from './oauth/google.service';
import { KakaoService } from './oauth/kakao.service';
import { NaverService } from './oauth/naver.service';
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from './token/token.service';
import { AuthData } from './types/auth-data.type';
import { OauthAuthorizeData } from './types/oauth-authorize-data.type';
import { OauthData } from './types/oauth-data.type';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogsService } from '../dogs/dogs.service';
import { S3Service } from '../s3/s3.service';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';

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

    private readonly REDIRECT_URI = this.configService.get<string>('CORS_ORIGIN') + '/callback';
    private readonly S3_PROFILE_IMAGE_PATH = 'default/profile.png';

    async login({ authorizeCode, provider }: OauthAuthorizeData): Promise<AuthData | OauthData | undefined> {
        const { access_token: oauthAccessToken, refresh_token: oauthRefreshToken } = await this[
            `${provider}Service`
        ].requestToken(authorizeCode, this.REDIRECT_URI);

        const { oauthId } = await this[`${provider}Service`].requestUserInfo(oauthAccessToken);

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

    async logout({ userId, provider }: AccessTokenPayload): Promise<void> {
        const { oauthAccessToken } = await this.usersService.findOne({ id: userId });
        this.logger.debug('logout - oauthAccessToken', { oauthAccessToken });

        if (provider === 'kakao') {
            await this.kakaoService.requestTokenExpiration(oauthAccessToken);
        }
    }

    async reissueTokens({ oauthId, provider }: RefreshTokenPayload): Promise<AuthData> {
        const { id: userId, oauthRefreshToken } = await this.usersService.findOne({ oauthId });

        // TODO: Promise.all로 병렬처리 한 후 성능 비교하기
        // const [
        //     { access_token: newOauthAccessToken, refresh_token: newOauthRefreshToken },
        //     newAccessToken,
        //     newRefreshToken,
        // ] = await Promise.all([
        //     this[`${provider}Service`].requestTokenRefresh(oauthRefreshToken),
        //     this.tokenService.signAccessToken(userId, provider),
        //     this.tokenService.signRefreshToken(oauthId, provider),
        // ]);
        const { access_token: newOauthAccessToken, refresh_token: newOauthRefreshToken } =
            await this[`${provider}Service`].requestTokenRefresh(oauthRefreshToken);

        const newAccessToken = await this.tokenService.signAccessToken(userId, provider);
        const newRefreshToken = await this.tokenService.signRefreshToken(oauthId, provider);

        const attributes: Partial<Users> = { oauthAccessToken: newOauthAccessToken, refreshToken: newRefreshToken };

        if (newOauthRefreshToken) {
            attributes.oauthRefreshToken = newOauthRefreshToken;
        }

        this.usersService.update({ id: userId }, attributes);

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

        // TODO: for문 없애고 batch delete 하기
        for (const dogId of dogIds) {
            await this.dogsService.deleteDogFromUser(userId, dogId);
        }

        // TODO: Promise.all로 병렬 처리
        await this.usersService.delete({ id: userId });
        await this.s3Service.deleteObjectFolder(userId);
    }

    async validateAccessToken(token: string): Promise<AccessTokenPayload> {
        const payload = (await this.tokenService.verify(token)) as AccessTokenPayload;
        this.logger.log('Payload', payload);

        const result = await this.usersService.findOne({ id: payload.userId });
        this.logger.debug('validateAccessToken - find User result', { ...result });

        return payload;
    }

    async validateRefreshToken(token: string): Promise<RefreshTokenPayload> {
        const payload = (await this.tokenService.verify(token)) as RefreshTokenPayload;
        this.logger.log('Payload', payload);

        const { refreshToken } = await this.usersService.findOne({ oauthId: payload.oauthId });

        if (refreshToken !== token) {
            throw new UnauthorizedException();
        }

        return payload;
    }
}
