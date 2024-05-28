import { OauthProvider } from 'src/auth/types/auth.type';
import { Role } from '../user-roles.enum';

export interface CreateUser {
    nickname: string;
    role: Role;
    mainDogId: number | undefined;
    oauthId: string;
    oauthAccessToken: string;
    oauthRefreshToken: string;
    refreshToken: string;
}

export interface UserProfile {
    nickname: string;
    email: string;
    profileImageUrl: string;
    provider: OauthProvider;
}
