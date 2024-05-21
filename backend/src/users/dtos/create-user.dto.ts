import { IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    oauthNickname: string;

    @IsString()
    email: string;

    @IsString()
    profileImageUrl: string;

    @IsString()
    oauthId: string;

    @IsString()
    oauthAccessToken: string;

    @IsString()
    oauthRefreshToken: string;

    @IsString()
    refreshToken: string;
}
