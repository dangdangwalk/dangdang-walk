import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OauthProvider } from '../auth.controller';

export interface AccessTokenPayload {
    userId: number;
    provider: OauthProvider;
}

export interface RefreshTokenPayload {
    oauthId: string;
}

type TokenType = 'access' | 'refresh';
type TokenExpiryMap = {
    [key in TokenType]: {
        expiresIn: string;
        maxAge: number; // [ms]
    };
};

export const TOKEN_LIFETIME_MAP: TokenExpiryMap = {
    access: { expiresIn: '12h', maxAge: 12 * 60 * 60 * 1000 },
    refresh: { expiresIn: '14d', maxAge: 14 * 24 * 60 * 60 * 1000 },
};

@Injectable()
export class TokenService {
    constructor(private jwtService: JwtService) {}

    signAccessToken(userId: number, provider: OauthProvider) {
        const payload: AccessTokenPayload = {
            userId,
            provider,
        };

        const newToken = this.jwtService.sign(payload, {
            expiresIn: TOKEN_LIFETIME_MAP.access.expiresIn,
        });

        return newToken;
    }

    signRefreshToken(oauthId: string) {
        const payload: RefreshTokenPayload = {
            oauthId,
        };

        const newToken = this.jwtService.sign(payload, {
            expiresIn: TOKEN_LIFETIME_MAP.refresh.expiresIn,
        });

        return newToken;
    }

    verify(token: string) {
        const payload = this.jwtService.verify<AccessTokenPayload | RefreshTokenPayload>(token, {
            ignoreExpiration: false,
        });

        return payload;
    }
}
