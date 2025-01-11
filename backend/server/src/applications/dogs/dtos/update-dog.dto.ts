import { IsBoolean, IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';

import { GENDER, Gender } from '../types/dogs.type';

export class UpdateDogDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    breed: string;

    @IsEnum(GENDER)
    @IsOptional()
    gender: Gender;

    @IsBoolean()
    @IsOptional()
    isNeutered: boolean;

    @IsString()
    @IsOptional()
    birth: string | null;

    @IsPositive()
    @IsOptional()
    weight: number;

    @IsString()
    @IsOptional()
    profilePhotoUrl: string | null;
}
