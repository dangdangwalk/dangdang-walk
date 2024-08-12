import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

import { GENDER, Gender } from '../types/dogs.type';

export class CreateDogDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    breed: string;

    @IsEnum(GENDER)
    @IsNotEmpty()
    gender: Gender;

    @IsBoolean()
    @IsNotEmpty()
    isNeutered: boolean;

    @IsString()
    @IsOptional()
    birth: string | null;

    @IsPositive()
    @IsNotEmpty()
    weight: number;

    @IsString()
    @IsOptional()
    profilePhotoUrl: string | null;
}
