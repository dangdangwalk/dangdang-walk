import { Injectable, Logger } from '@nestjs/common';
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

export interface OAuthService {
    requestToken(autherizeCode: string): Promise<any>;
    requestUserId(accessToken: string): Promise<any>;
    login(autherizeCode: string): Promise<{ accessToken: string; refreshToken: string }>;
}
