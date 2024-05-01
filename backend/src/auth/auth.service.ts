import { TokenService } from './token/token.service';
import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import { OauthProvider } from './auth.controller';
import { KakaoService } from './oauth/kakao.service';
import { NaverService } from './oauth/naver.service';
import { GoogleService } from './oauth/google.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        private readonly googleService: GoogleService,
        private readonly kakaoService: KakaoService,
        private readonly naverService: NaverService
    ) {}

    async login(
        authorizeCode: string,
        provider: OauthProvider
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const { access_token: oauthAccessToken, refresh_token: oauthRefreshToken } =
            await this[`${provider}Service`].requestToken(authorizeCode);
        const oauthId = await this[`${provider}Service`].requestUserId(oauthAccessToken);

        const refreshToken = this.tokenService.signRefreshToken(oauthId);

        const userId = await this.usersService.loginOrCreateUser(
            oauthId,
            oauthAccessToken,
            oauthRefreshToken,
            refreshToken
        );

        const accessToken = this.tokenService.signAccessToken(userId, provider);

        return { accessToken, refreshToken };
    }

    async validateRefreshToken(token: string, oauthId: string): Promise<boolean> {
        const user = await this.usersService.findOneWithOauthID(oauthId);

        return user.refreshToken === token;
    }
}
