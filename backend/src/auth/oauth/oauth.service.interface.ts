export interface OauthService {
    requestToken(authorizeCode: string): Promise<{
        access_token: string;
        refresh_token: string;
        [key: string]: any;
    }>;

    requestUserId(accessToken: string): Promise<string>;
}
