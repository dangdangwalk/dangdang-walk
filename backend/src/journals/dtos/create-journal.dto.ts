import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsWGS84 } from '../validator/WGS84.validator';
export class Location {
    @IsWGS84({ message: 'The provided point is not in WGS84 format' })
    lat: string;

    @IsWGS84({ message: 'The provided point is not in WGS84 format' })
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
    distance: number;

    @IsNotEmpty()
    calories: number;

    @IsNotEmpty()
    startedAt: Date;

    //TODO: validation 완성되면 number로 변경
    @IsNotEmpty()
    duration: string;

    @IsArray()
    @ValidateNested()
    @Type(() => journalLocation)
    routes: journalLocation[];

    @IsOptional()
    memo: string;

    @IsOptional()
    @IsString({ each: true })
    photoUrls: string[];
}

export class CreateJournalDto {
    @IsDefined()
    dogs: number[];

    @IsDefined()
    @ValidateNested()
    @Type(() => JournalInfoForCreate)
    journalInfo: JournalInfoForCreate;

    @IsOptional()
    @ValidateNested()
    @Type(() => ExcrementsInfoForCreate)
    excrements: ExcrementsInfoForCreate[];
}
