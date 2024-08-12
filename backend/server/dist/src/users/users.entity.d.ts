import { Role } from './types/role.type';
import { Dogs } from '../dogs/dogs.entity';
export declare class Users {
    id: number;
    nickname: string;
    email: string;
    profileImageUrl: string;
    role: Role;
    mainDog: Dogs;
    mainDogId: number | null;
    oauthId: string;
    oauthAccessToken: string;
    oauthRefreshToken: string;
    refreshToken: string;
    createdAt: Date;
    constructor(entityData: Partial<Users>);
}
