import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Dogs } from 'src/dogs/dogs.entity';

import { Excrement } from 'src/excrements/types/excrement.type';

import { Journals } from '../journals.entity';

export class PhotoUrlType {
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

    // TODO: reflect-metadata 사용하도록 변경
    static getKeysForDogTable(): Array<keyof Dogs> {
        return ['id', 'name', 'profilePhotoUrl'];
    }
}
export class ExcrementsCount {
    dogId: number;
    type: Excrement;
    count: number;
}

export class ExcrementsInfoForDetail {
    dogId: number;

    fecesCnt: number;

    urineCnt: number;

    constructor() {
        return {
            dogId: 0,
            fecesCnt: 0,
            urineCnt: 0,
        };
    }
}

export class JournalInfoForDetail {
    @IsNotEmpty()
    @IsString()
    routes: Location[];

    @IsNotEmpty()
    memo: string;

    @IsNotEmpty()
    @IsString({ each: true })
    journalPhotos: string[];

    static getKeysForJournalTable(): Array<keyof Journals> {
        return ['journalPhotos', 'routes', 'memo'];
    }
}

export class JournalDetail {
    journalInfo: JournalInfoForDetail;

    dogs: DogInfoForDetail[];

    excrements: ExcrementsInfoForDetail[];

    constructor(journalInfo: JournalInfoForDetail, dogInfo: DogInfoForDetail[], excrements: ExcrementsInfoForDetail[]) {
        this.journalInfo = journalInfo;
        this.dogs = dogInfo;
        this.excrements = excrements;
    }
}
