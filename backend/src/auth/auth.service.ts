import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
    userId: number;
    provider: Provider;
}

type Provider = 'kakao' | 'naver' | 'google';
type TokenType = 'access' | 'refresh';
type TokenExpiryMap = {
    [key in TokenType]: string;
};

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    private readonly logger = new Logger(AuthService.name);

    signToken(userId: number, tokenType: TokenType, provider: Provider) {
        const tokenExpiryMap: TokenExpiryMap = {
            access: '12h',
            refresh: '14d',
        };

        const payload: JwtPayload = {
            userId,
            provider,
        };

        const newToken = this.jwtService.sign(payload, {
            expiresIn: tokenExpiryMap[tokenType],
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
    requestUserInfo(accessToken: string): Promise<any>;
    login(autherizeCode: string): Promise<{ accessToken: string }>;
}
