import { OauthProvider } from '../../auth/types/oauth-provider.type';

export interface UserProfile {
    nickname: string;
    email: string;
    profileImageUrl: string;
    provider: OauthProvider;
}
