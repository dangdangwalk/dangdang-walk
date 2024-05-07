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
