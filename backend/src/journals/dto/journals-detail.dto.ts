import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class PhotoUrlDto {
    @IsNotEmpty()
    @IsString()
    photoUrl: string;

    static getKey() {
        return 'photoUrl';
    }
}

export class DogInfoForDetail {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    profilePhotoUrl: string | null;

    @IsNotEmpty()
    fecesCnt: number;

    @IsNotEmpty()
    urinesCnt: number;

    // TODO: reflect -metadata 사용하도록 변경
    static getKeysForDogTable() {
        return ['id', 'name', 'profilePhotoUrl'];
    }
}

export class Companions {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    name: string;

    profilePhotoUrl: string | null;
}

export class RouteDto {
    @IsNotEmpty()
    x: number;

    @IsNotEmpty()
    y: number;
}

export class JournalInfoForDetail {
    @IsNotEmpty()
    distance: number;

    @IsNotEmpty()
    calories: number;

    @IsNotEmpty()
    startedAt: Date;

    @IsNotEmpty()
    duration: number;

    @IsNotEmpty()
    @IsString()
    routeImageUrl: string;

    @IsNotEmpty()
    memo: string;

    @IsNotEmpty()
    @IsString({ each: true })
    photoUrls: string[];

    static getKeysForJournalTable() {
        return ['distance', 'calories', 'startedAt', 'duration', 'routeImageUrl', 'memo'];
    }
    static getKeysForJournalPhotoTable() {
        return ['photoUrls'];
    }
}

export class JournalDetailDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => JournalInfoForDetail)
    journalInfo: JournalInfoForDetail;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DogInfoForDetail)
    dog: DogInfoForDetail;

    @IsNotEmpty()
    @Type(() => Companions)
    companions: Companions[];

    constructor(journalInfo: JournalInfoForDetail, dogInfo: DogInfoForDetail, companions: Companions[]) {
        this.journalInfo = journalInfo;
        this.dog = dogInfo;
        this.companions = companions;
    }
}
