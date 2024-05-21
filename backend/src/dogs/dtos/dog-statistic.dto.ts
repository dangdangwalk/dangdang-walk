import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DogStatisticDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    profilePhotoUrl: string | null;

    @IsNumber()
    recommendedWalkAmount: number;

    @IsNumber()
    todayWalkAmount: number;

    @IsNumber({}, { each: true })
    weeklyWalks: number[];
}
