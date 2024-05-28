import { OauthProvider } from 'src/auth/types/oauth-provider.type';

export interface UserProfile {
    nickname: string;
    email: string;
    profileImageUrl: string;
    provider: OauthProvider;
}
