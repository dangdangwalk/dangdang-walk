import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
        private readonly naverService: NaverService,
        private readonly configService: ConfigService
    ) {}

    private getFullURI(redirectURI: string) {
        if (!redirectURI.startsWith('/')) return redirectURI;

        return this.configService.get<string>('CORS_ORIGIN') + redirectURI;
    }

    private async getOauthData(
        authorizeCode: string,
        provider: OauthProvider,
        redirectURI: string
    ): Promise<{ oauthAccessToken: string; oauthRefreshToken: string; oauthId: string }> {
        const { access_token: oauthAccessToken, refresh_token: oauthRefreshToken } = await this[
            `${provider}Service`
        ].requestToken(authorizeCode, this.getFullURI(redirectURI));

        const oauthId = await this[`${provider}Service`].requestUserId(oauthAccessToken);

        return { oauthAccessToken, oauthRefreshToken, oauthId };
    }

    async login(
        authorizeCode: string,
        provider: OauthProvider,
        redirectURI: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const { oauthAccessToken, oauthRefreshToken, oauthId } = await this.getOauthData(
            authorizeCode,
            provider,
            redirectURI
        );

        const refreshToken = this.tokenService.signRefreshToken(oauthId, provider);

        const { id: userId } = await this.usersService.updateAndFindOne(
            { oauthId },
            { oauthAccessToken, oauthRefreshToken, refreshToken }
        );

        const accessToken = this.tokenService.signAccessToken(userId, provider);

        return { accessToken, refreshToken };
    }

    async signin(
        authorizeCode: string,
        provider: OauthProvider,
        redirectURI: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const { oauthAccessToken, oauthRefreshToken, oauthId } = await this.getOauthData(
            authorizeCode,
            provider,
            redirectURI
        );

        const refreshToken = this.tokenService.signRefreshToken(oauthId, provider);

        const { id: userId } = await this.usersService.createIfNotExists(
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
