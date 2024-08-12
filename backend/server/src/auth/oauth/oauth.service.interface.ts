export interface RequestToken {
    access_token: string;
    refresh_token: string;
    [key: string]: any;
}

export interface RequestTokenRefresh extends Omit<RequestToken, 'refresh_token'> {
    refresh_token?: string;
}

export interface RequestUserInfo {
    oauthId: string;
    oauthNickname: string;
    email: string;
    profileImageUrl: string;
}

export interface OauthService {
    requestToken(authorizeCode: string, redirectURI?: string): Promise<RequestToken>;

    requestUserInfo(accessToken: string): Promise<RequestUserInfo>;

    requestTokenExpiration(accessToken: string): Promise<void>;

    requestUnlink?(accessToken: string): Promise<void>;

    requestTokenRefresh(refreshToken: string): Promise<RequestTokenRefresh>;
}
