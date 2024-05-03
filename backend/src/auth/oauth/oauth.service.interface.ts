interface RequestToken {
    access_token: string;
    refresh_token: string;
    [key: string]: any;
}

export interface RequestTokenRefreshResponse extends Omit<RequestToken, 'refresh_token'> {
    refresh_token?: string;
}

export interface OauthService {
    requestToken(authorizeCode: string, redirectURI?: string): Promise<RequestToken>;

    requestUserId(accessToken: string): Promise<string>;

    requestTokenExpiration(accessToken: string): Promise<void>;

    requestUnlink?(accessToken: string): Promise<void>;

    requestTokenRefresh(refreshToken: string): Promise<RequestTokenRefreshResponse>;
}
