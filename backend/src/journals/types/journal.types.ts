import { Dogs } from 'src/dogs/dogs.entity';

import { Journals } from '../journals.entity';

//산책일지 생성
export interface CreateExcrementsInfo {
    dogId: number;
    fecesLocations: [number, number][];
    urineLocations: [number, number][];
}

export class CreateJournalInfo {
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routes: [number, number][];
    memo: string;
    journalPhotos: string[];

    static getKeysForJournalTable(): Array<keyof Journals> {
        return ['distance', 'calories', 'startedAt', 'duration', 'routes', 'memo'];
    }
}

export interface CreateJournalData {
    dogs: number[];
    journalInfo: CreateJournalInfo;
    excrements: CreateExcrementsInfo[];
}

export type ExcrementCount = {
    dogId: number;
    fecesCnt: number;
    urineCnt: number;
};

//산책일지 목록

interface JournalWalkDistance {
    distance: number;
    duration: number;
}

interface JournalWalkDate {
    startedAt: Date;
}

export type DogWalkJournalEntry = JournalWalkDistance & JournalWalkDate;

export class JournalInfoForList {
    journalId: number;

    journalCnt: number;

    startedAt: Date;

    distance: number;

    calories: number;

    duration: number;

    static getKeysForJournalInfoResponse() {
        return ['journalId', 'startedAt', 'distance', 'calories', 'duration', 'journalCnt'];
    }
}

//산책일지 수정
export type UpdateTodayWalkTimeOperation = (current: number, operand: number) => number;
export type UpdateDogWalkDayOperation = (current: number) => number;

export interface UpdateJournalData {
    memo: string;
    journalPhotos: string[];
}

//산책일지 상세
export class PhotoUrlType {
    photoUrl: string;

    static getKey() {
        return 'photoUrl';
    }
}

export class DogInfoForDetail {
    id: number;

    name: string;

    profilePhotoUrl: string | null;

    // TODO: reflect-metadata 사용하도록 변경
    static getKeysForDogTable(): Array<keyof Dogs> {
        return ['id', 'name', 'profilePhotoUrl'];
    }
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
    routes: Location[];

    memo: string;

    journalPhotos: string[];

    static getKeysForJournalTable(): Array<keyof Journals> {
        return ['routes', 'memo'];
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
