import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    nickname: string;

    @IsString()
    @IsOptional()
    profileImage: string;
}
