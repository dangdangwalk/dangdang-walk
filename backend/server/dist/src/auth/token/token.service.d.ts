import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
        maxAge: number;
    };
};
export declare class TokenService {
    private readonly jwtService;
    private readonly configService;
    static TOKEN_LIFETIME_MAP: TokenExpiryMap;
    constructor(jwtService: JwtService, configService: ConfigService);
    signAccessToken(userId: number, provider: OauthProvider): Promise<string>;
    signRefreshToken(oauthId: string, provider: OauthProvider): Promise<string>;
    verify(token: string): Promise<AccessTokenPayload | RefreshTokenPayload>;
}
export {};
