import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Gender } from '../dogs-gender.enum';

export class DogDto {
    @IsString()
    name: string;

    @IsString()
    breed: string;

    @IsEnum(Gender)
    gender: 'MALE' | 'FEMALE';

    @IsBoolean()
    isNeutered: boolean;

    @IsDate()
    birth: Date | null;

    @IsNumber()
    weight: number;

    @IsString()
    @IsOptional()
    profilePhotoUrl: string | null;
}
