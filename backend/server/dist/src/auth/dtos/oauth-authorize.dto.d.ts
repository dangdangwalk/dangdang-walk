import { OauthProvider } from '../types/oauth-provider.type';
export declare class OauthAuthorizeDto {
    authorizeCode: string;
    provider: OauthProvider;
}
