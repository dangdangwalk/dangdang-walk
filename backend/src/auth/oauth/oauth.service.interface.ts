export interface OauthService {
    requestToken(
        authorizeCode: string,
        redirectURI?: string
    ): Promise<{
        access_token: string;
        refresh_token: string;
        [key: string]: any;
    }>;

    requestUserId(accessToken: string): Promise<string>;

    requestTokenExpiration(accessToken: string): Promise<void>;
}
