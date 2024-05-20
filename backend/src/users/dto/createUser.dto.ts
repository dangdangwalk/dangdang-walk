import { IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    oauthNickname: string;

    @IsString()
    email: string;

    @IsString()
    profileImage: string;

    @IsString()
    oauthId: string;

    @IsString()
    oauthAccessToken: string;

    @IsString()
    oauthRefreshToken: string;

    @IsString()
    refreshToken: string;
}
