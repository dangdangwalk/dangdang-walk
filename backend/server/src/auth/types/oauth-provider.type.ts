export const OAUTH_PROVIDERS = ['google', 'kakao', 'naver'] as const;

export type OauthProvider = (typeof OAUTH_PROVIDERS)[number];
