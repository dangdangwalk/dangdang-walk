import { Dogs } from '../../dogs/dogs.entity';

import { Journals } from '../journals.entity';

type Coordinate = [number, number];

//산책일지 생성
export interface ExcrementsInputForCreate {
    dogId: number;
    fecesLocations: Coordinate[];
    urineLocations: Coordinate[];
}

export interface JournalInputForCreate {
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routes: Coordinate[];
    memo: string;
    journalPhotos: string[];
}

export interface CreateJournalRequest {
    dogs: number[];
    journalInfo: JournalInputForCreate;
    excrements: ExcrementsInputForCreate[];
}

export interface ExcrementCount {
    dogId: number;
    fecesCnt: number;
    urineCnt: number;
}

export class CreateJournalDatabaseInput {
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routes: string;
    memo: string;
    journalPhotos: string;
    excrementCount: string;

    static getKeysForJournalRequest(): Array<keyof Journals> {
        return ['distance', 'calories', 'startedAt', 'duration'];
    }
}

//산책일지 목록
interface JournalWalkDistance {
    distance: number;
    duration: number;
}

interface JournalWalkDate {
    startedAt: Date;
}

export type DogWalkJournalRaw = JournalWalkDistance & JournalWalkDate;

export class JournalListResponse {
    journalId: number;
    journalCnt: number;
    startedAt: Date;
    distance: number;
    calories: number;
    duration: number;

    static getKeysForJournalListRaw() {
        return ['journalId', 'startedAt', 'distance', 'calories', 'duration', 'journalCnt'];
    }
}

//산책일지 수정
export type UpdateTodayWalkTimeOperation = (current: number, operand: number) => number;
export type UpdateDogWalkDayOperation = (current: number) => number;

export type UpdateJournalRequest = {
    memo?: string;
    journalPhotos?: string[];
};

export type UpdateJournalDatabaseInput = {
    memo?: string;
    journalPhotos?: string;
};

//산책일지 상세
export class DogOutputForDetail {
    id: number;
    name: string;
    profilePhotoUrl: string | null;

    static getFieldForDogTable(): Array<keyof Dogs> {
        return ['id', 'name', 'profilePhotoUrl'];
    }
}

export interface JournalDetailRaw {
    id: number;
    routes: string;
    memo: string;
    journalPhotos: string;
    excrementCount: string;
}

export class JournalOutputForDetail {
    id: number;
    routes: [number, number][];
    memo: string;
    journalPhotos: string[];
    excrementCount: ExcrementCount[];

    static getFieldForJournalTable(): Array<keyof Journals> {
        return ['id', 'routes', 'memo', 'journalPhotos', 'excrementCount'];
    }
}

export class JournalDetailResponse {
    journalInfo: JournalOutputForDetail;
    dogs: DogOutputForDetail[];

    constructor(journalInfo: JournalOutputForDetail, dogInfo: DogOutputForDetail[]) {
        this.journalInfo = journalInfo;
        this.dogs = dogInfo;
    }
}
