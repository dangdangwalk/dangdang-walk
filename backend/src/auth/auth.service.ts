import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token/token.service';

export type Provider = 'kakao' | 'naver' | 'google';

export abstract class AuthService {
    constructor(
        protected readonly configService: ConfigService,
        protected readonly httpService: HttpService,
        private readonly tokenService: TokenService,
        protected readonly PROVIDER: Provider
    ) {}

    protected abstract requestToken(autherizeCode: string): Promise<any>;

    protected abstract requestUserId(accessToken: string): Promise<number | string>;

    async login(autherizeCode: string): Promise<{ accessToken: string; refreshToken: string }> {
        const { access_token: oauthAccessToken } = await this.requestToken(autherizeCode);
        const oauthId = await this.requestUserId(oauthAccessToken);

        // oauthId가 users table에 존재하는지 확인해서 로그인 or 회원가입 처리하고 userId 가져오기
        const userId = 1;
        const accessToken = this.tokenService.sign(userId, 'access', this.PROVIDER);
        const refreshToken = this.tokenService.sign(userId, 'refresh', this.PROVIDER);
        // users table에 refreshToken 저장

        return { accessToken, refreshToken };
    }
}
