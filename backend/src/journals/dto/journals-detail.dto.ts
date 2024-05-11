import { Type } from 'class-transformer';
import { IsNotEmpty, IsUrl, ValidateNested } from 'class-validator';

export class PhotoUrlDto {
    @IsNotEmpty()
    @IsUrl()
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

    @IsNotEmpty()
    @IsUrl()
    photoUrl: string;

    @IsNotEmpty()
    fecesCnt: number;

    @IsNotEmpty()
    urinesCnt: number;

    //TODO : reflect -metadata 사용하도록 변경
    static getKeysForDogTable() {
        return ['id', 'name', 'photoUrl'];
    }
}

export class Companions {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    photoUrl: string;
}

export class RouteDto {
    @IsNotEmpty()
    x: number;

    @IsNotEmpty()
    y: number;
}

export class JournalInfoForDetail {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    distance: number;

    @IsNotEmpty()
    calorie: number;

    @IsNotEmpty()
    duration: number;

    @IsNotEmpty()
    @IsUrl()
    routeUrl: string;

    @IsNotEmpty()
    memo: string;

    @IsNotEmpty()
    @IsUrl({}, { each: true })
    photoUrls: string[];

    static getKeysForJournalTable() {
        return ['title', 'distance', 'calories', 'duration', 'logImageUrl', 'memo'];
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
