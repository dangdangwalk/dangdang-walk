import { OauthProvider } from './oauth-provider.type';

export interface OauthData {
    oauthAccessToken: string;
    oauthRefreshToken: string;
    provider: OauthProvider;
}
