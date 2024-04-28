import { IsEmail, IsOptional, IsString } from 'class-validator';

export class IsMemberDto {
    @IsString()
    userId: string;

    @IsString()
    @IsOptional()
    role?: string;
}
