import { OauthProvider } from './oauth-provider.type';

export interface OauthAuthorizeData {
    authorizeCode: string;
    provider: OauthProvider;
}
