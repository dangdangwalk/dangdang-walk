import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
    userId: number;
    provider: Provider;
}

type Provider = 'kakao' | 'naver' | 'google';
type TokenType = 'access' | 'refresh';
type TokenExpiryMap = {
    [key in TokenType]: {
        expiresIn: string;
        maxAge: number;
    };
};

export const TOKEN_LIFETIME_MAP: TokenExpiryMap = {
    access: { expiresIn: '12h', maxAge: 12 * 60 * 60 * 1000 },
    refresh: { expiresIn: '14d', maxAge: 14 * 24 * 60 * 60 * 1000 },
};

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    private readonly logger = new Logger(AuthService.name);

    signToken(userId: number, tokenType: TokenType, provider: Provider) {
        const payload: JwtPayload = {
            userId,
            provider,
        };

        const newToken = this.jwtService.sign(payload, {
            expiresIn: TOKEN_LIFETIME_MAP[tokenType].expiresIn,
        });

        return newToken;
    }

    decodeToken(token: string) {
        const data = this.jwtService.verify<JwtPayload>(token);

        return data;
    }
}

export abstract class OAuthService {
    constructor(
        protected readonly configService: ConfigService,
        protected readonly httpService: HttpService,
        private readonly authService: AuthService,
        protected readonly PROVIDER: Provider
    ) {}

    abstract requestToken(autherizeCode: string): Promise<any>;

    abstract requestUserId(accessToken: string): Promise<number | string>;

    async login(autherizeCode: string): Promise<{ accessToken: string; refreshToken: string }> {
        const { access_token: oauthAccessToken } = await this.requestToken(autherizeCode);
        const oauthId = await this.requestUserId(oauthAccessToken);

        // oauthId가 users table에 존재하는지 확인해서 로그인 or 회원가입 처리하고 userId 가져오기
        const userId = 1;
        const accessToken = this.authService.signToken(userId, 'access', this.PROVIDER);
        const refreshToken = this.authService.signToken(userId, 'refresh', this.PROVIDER);
        // users table에 refreshToken 저장

        return { accessToken, refreshToken };
    }
}
