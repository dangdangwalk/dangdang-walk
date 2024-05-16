import { IsNumber, IsString } from 'class-validator';

export class DogStatisticDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    profilePhotoUrl: string;

    @IsNumber()
    recommendedWalkAmount: number;

    @IsNumber()
    dailyWalkAmount: number;

    @IsNumber({}, { each: true })
    weeklyWalks: number[];
}
