import { Injectable } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { OauthProvider } from './auth.controller';
import { GoogleService } from './oauth/google.service';
import { KakaoService } from './oauth/kakao.service';
import { NaverService } from './oauth/naver.service';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        private readonly googleService: GoogleService,
        private readonly kakaoService: KakaoService,
        private readonly naverService: NaverService
    ) {}

    async isUser(oauthAccessToken: string, provider: OauthProvider): Promise<boolean> {
        const oauthId = await this[`${provider}Service`].requestUserId(oauthAccessToken);

        try {
            await this.usersService.findOne({ oauthId });
            return true;
        } catch {
            return false;
        }
    }

    async login(
        oauthAccessToken: string,
        oauthRefreshToken: string,
        provider: OauthProvider
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const oauthId = await this[`${provider}Service`].requestUserId(oauthAccessToken);

        const refreshToken = this.tokenService.signRefreshToken(oauthId, provider);

        const userId = await this.usersService.loginOrCreateUser(
            oauthId,
            oauthAccessToken,
            oauthRefreshToken,
            refreshToken
        );

        const accessToken = this.tokenService.signAccessToken(userId, provider);

        return { accessToken, refreshToken };
    }

    async logout(id: number, provider: OauthProvider): Promise<void> {
        const { oauthAccessToken } = await this.usersService.findOne({ id });

        await this[`${provider}Service`].requestTokenExpiration(oauthAccessToken);
    }

    async deactivate(id: number, provider: OauthProvider): Promise<void> {
        const { oauthAccessToken } = await this.usersService.findOne({ id });

        if (provider === 'kakao') {
            await this[`${provider}Service`].requestUnlink(oauthAccessToken);
        } else {
            await this[`${provider}Service`].requestTokenExpiration(oauthAccessToken);
        }

        await this.usersService.delete({ id });
    }

    async validateAccessToken(id: number): Promise<boolean> {
        try {
            await this.usersService.findOne({ id });
            return true;
        } catch (error) {
            return false;
        }
    }

    async validateRefreshToken(token: string, oauthId: string): Promise<boolean> {
        const { refreshToken } = await this.usersService.findOne({ oauthId });

        return refreshToken === token;
    }

    async reissueTokens(
        oauthId: string,
        provider: OauthProvider
    ): Promise<{ accessToken: string; refreshToken: string }> {
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
}
