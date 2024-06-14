import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { parse } from '../../utils/ms.util';
import { OauthProvider } from '../types/oauth-provider.type';

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

@Injectable()
export class TokenService {
    static TOKEN_LIFETIME_MAP: TokenExpiryMap;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        const ACCESS_TOKEN_LIFETIME = this.configService.get<string>('ACCESS_TOKEN_LIFETIME', '1h');
        const REFRESH_TOKEN_LIFETIME = this.configService.get<string>('REFRESH_TOKEN_LIFETIME', '14d');

        TokenService.TOKEN_LIFETIME_MAP = {
            access: { expiresIn: ACCESS_TOKEN_LIFETIME, maxAge: parse(ACCESS_TOKEN_LIFETIME) },
            refresh: { expiresIn: REFRESH_TOKEN_LIFETIME, maxAge: parse(REFRESH_TOKEN_LIFETIME) },
        };
    }

    async signAccessToken(userId: number, provider: OauthProvider) {
        const payload: AccessTokenPayload = {
            userId,
            provider,
        };

        const newToken = await this.jwtService.signAsync(payload, {
            expiresIn: TokenService.TOKEN_LIFETIME_MAP.access.expiresIn,
        });

        return newToken;
    }

    async signRefreshToken(oauthId: string, provider: OauthProvider) {
        const payload: RefreshTokenPayload = {
            oauthId,
            provider,
        };

        const newToken = await this.jwtService.signAsync(payload, {
            expiresIn: TokenService.TOKEN_LIFETIME_MAP.refresh.expiresIn,
        });

        return newToken;
    }

    async verify(token: string): Promise<AccessTokenPayload | RefreshTokenPayload> {
        const payload = await this.jwtService.verifyAsync(token, {
            ignoreExpiration: false,
        });

        if ('userId' in payload) {
            payload.userId = parseInt(payload.userId);
        }

        return payload;
    }
}
