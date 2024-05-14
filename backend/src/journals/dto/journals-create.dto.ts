import { Type } from 'class-transformer';
import {
    IsArray,
    IsDefined,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsUrl,
    ValidateNested,
} from 'class-validator';
// TODO: 문자열이면서 숫자 범위를 넘지 않는지 확인하는 custom Validator 만들기..?
export class Location {
    @IsNumber()
    lat: string;

    @IsNumber()
    lng: string;
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
    title: string;

    @IsNotEmpty()
    distance: number;

    @IsNotEmpty()
    calories: number;

    @IsNotEmpty()
    startedAt: Date;

    @IsNotEmpty()
    duration: number;

    @IsNotEmpty()
    @IsUrl()
    routeImageUrl: string;

    @IsOptional()
    memo: string;

    @IsOptional()
    @IsUrl({}, { each: true })
    photoUrls: string[];

    static getKeysForJournalTable() {
        return ['title', 'distance', 'calories', 'startedAt', 'duration', 'routeImageUrl', 'memo'];
    }
    static getKeysForJournalPhotoTable() {
        return ['photoUrls'];
    }
}

export class CreateJournalDto {
    @IsNotEmpty()
    dogs: number[];

    @IsDefined()
    @IsNotEmptyObject()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => JournalInfoForCreate)
    journalInfo: JournalInfoForCreate;

    @IsOptional()
    @IsDefined()
    @ValidateNested()
    @Type(() => ExcrementsInfoForCreate)
    excrements: ExcrementsInfoForCreate[];
}
