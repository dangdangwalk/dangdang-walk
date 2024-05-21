import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { parse } from '../../utils/ms.util';
import { OauthProvider } from '../types/auth.type';

export interface AccessTokenPayload {
    userId: number;
    provider: OauthProvider;
}

export interface RefreshTokenPayload {
    oauthId: string;
    provider: OauthProvider;
}

type TokenType = 'access' | 'refresh';
type TokenExpiryMap = {
    [key in TokenType]: {
        expiresIn: string;
        maxAge: number; // [ms]
    };
};

const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME || '1h';
const REFRESH_TOKEN_LIFETIME = process.env.REFRESH_TOKEN_LIFETIME || '14d';

export const TOKEN_LIFETIME_MAP: TokenExpiryMap = {
    access: { expiresIn: ACCESS_TOKEN_LIFETIME, maxAge: parse(ACCESS_TOKEN_LIFETIME) },
    refresh: { expiresIn: REFRESH_TOKEN_LIFETIME, maxAge: parse(REFRESH_TOKEN_LIFETIME) },
};

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

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

    signRefreshToken(oauthId: string, provider: OauthProvider) {
        const payload: RefreshTokenPayload = {
            oauthId,
            provider,
        };

        const newToken = this.jwtService.sign(payload, {
            expiresIn: TOKEN_LIFETIME_MAP.refresh.expiresIn,
        });

        return newToken;
    }

    verify(token: string): AccessTokenPayload | RefreshTokenPayload {
        const payload = this.jwtService.verify(token, {
            ignoreExpiration: false,
        });

        if ('userId' in payload) payload.userId = parseInt(payload.userId);

        return payload;
    }
}
