export const OAUTH_PROVIDERS = ['google', 'kakao', 'naver'] as const;

export type OauthProvider = (typeof OAUTH_PROVIDERS)[number];

export interface OauthAuthorizeData {
    authorizeCode: string;
    provider: OauthProvider;
}

export interface AuthData {
    accessToken: string;
    refreshToken: string;
}

export interface OauthData {
    oauthAccessToken: string;
    oauthRefreshToken: string;
    provider: OauthProvider;
}
