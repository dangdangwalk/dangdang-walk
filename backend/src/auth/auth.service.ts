import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token/token.service';
import { UsersService } from 'src/users/users.service';

export type Provider = 'kakao' | 'naver' | 'google';

export abstract class AuthService {
    constructor(
        protected readonly configService: ConfigService,
        protected readonly httpService: HttpService,
        private readonly tokenService: TokenService,
        protected readonly usersService: UsersService,
        protected readonly PROVIDER: Provider
    ) {}

    protected abstract requestToken(autherizeCode: string): Promise<{
        access_token: string;
        refresh_token: string;
        [key: string]: any;
    }>;

    protected abstract requestUserId(accessToken: string): Promise<string>;

    async login(autherizeCode: string): Promise<{ accessToken: string; refreshToken: string }> {
        const { access_token: oauthAccessToken, refresh_token: oauthRefreshToken } =
            await this.requestToken(autherizeCode);
        const oauthId = await this.requestUserId(oauthAccessToken);

        const refreshToken = this.tokenService.signRefreshToken();

        const userId = await this.usersService.loginOrCreateUser(
            oauthId,
            oauthAccessToken,
            oauthRefreshToken,
            refreshToken
        );

        const accessToken = this.tokenService.signAccessToken(userId, this.PROVIDER);

        return { accessToken, refreshToken };
    }
}
