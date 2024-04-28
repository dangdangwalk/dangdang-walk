import { IsEmail, IsString } from 'class-validator';

export class IsMemberDto {
    @IsString()
    userId: string;
}
