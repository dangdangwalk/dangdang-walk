import { OauthProvider } from '../types/oauth-provider.type';
export declare class OauthDto {
    oauthAccessToken: string;
    oauthRefreshToken: string;
    provider: OauthProvider;
}
