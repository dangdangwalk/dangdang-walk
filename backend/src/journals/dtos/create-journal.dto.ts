import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

import { IsWGS84 } from '../validators/WGS84.validator';

export class ExcrementsInfoForCreate {
    @IsNotEmpty()
    dogId: number;

    @IsWGS84()
    fecesLocations: [number, number][];

    @IsWGS84()
    urineLocations: [number, number][];
}

export class JournalInfoForCreate {
    @IsNotEmpty()
    @Max(100000) //TODO: 합의 필요
    @Min(0)
    distance: number;

    @IsNotEmpty()
    @Max(10800) //TODO: 합의 필요
    @Min(0)
    calories: number;

    @IsNotEmpty()
    @IsDateString()
    startedAt: Date;

    @IsNotEmpty()
    @IsNumber()
    @Max(10800) //TODO: 합의 필요
    @Min(0)
    duration: number;

    @IsWGS84()
    routes: [number, number][];

    @IsOptional()
    @IsString()
    memo: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photoUrls: string[];
}

export class CreateJournalDto {
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    dogs: number[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => JournalInfoForCreate)
    journalInfo: JournalInfoForCreate;

    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => ExcrementsInfoForCreate)
    excrements: ExcrementsInfoForCreate[];
}
