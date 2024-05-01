import { IsNumber, IsString } from 'class-validator';

export class DogStatisticDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    photoUrl: string;

    @IsNumber()
    amountOfWalk: number;

    @IsNumber()
    walkTime: number;

    @IsNumber({}, { each: true })
    weeklyWalkCheck: number[];
}
