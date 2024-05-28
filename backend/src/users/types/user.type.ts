import { OauthProvider } from 'src/auth/types/oauth-provider.type';

export interface CreateUser {
    oauthNickname: string;
    email: string;
    profileImageUrl: string;
    oauthId: string;
    oauthAccessToken: string;
    oauthRefreshToken: string;
    refreshToken: string;
}

export interface UpdateUser {
    nickname: string;
    profileImageUrl: string;
}

export interface UserProfile {
    nickname: string;
    email: string;
    profileImageUrl: string;
    provider: OauthProvider;
}
