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

export class Location {
    @IsWGS84({ message: 'The provided point is not in WGS84 format' })
    @IsString()
    lat: string;

    @IsWGS84({ message: 'The provided point is not in WGS84 format' })
    @IsString()
    lng: string;
}

//TODO: GeoJSON으로 넘어가기 전 임시로 사용
export class journalLocation {
    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;
}

export class ExcrementsInfoForCreate {
    @IsNotEmpty()
    dogId: number;

    @IsArray()
    @ValidateNested()
    @Type(() => Location)
    fecesLocations: Location[];

    @IsArray()
    @ValidateNested()
    @Type(() => Location)
    urineLocations: Location[];
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

    @IsArray()
    @ValidateNested()
    @Type(() => journalLocation)
    routes: journalLocation[];

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
