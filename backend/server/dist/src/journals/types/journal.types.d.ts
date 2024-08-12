import { Dogs } from '../../dogs/dogs.entity';
import { Journals } from '../journals.entity';
type Coordinate = [number, number];
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
export declare class CreateJournalDatabaseInput {
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routes: string;
    memo: string;
    journalPhotos: string;
    excrementCount: string;
    static getKeysForJournalRequest(): Array<keyof Journals>;
}
interface JournalWalkDistance {
    distance: number;
    duration: number;
}
interface JournalWalkDate {
    startedAt: Date;
}
export type DogWalkJournalRaw = JournalWalkDistance & JournalWalkDate;
export declare class JournalListResponse {
    journalId: number;
    journalCnt: number;
    startedAt: Date;
    distance: number;
    calories: number;
    duration: number;
    static getKeysForJournalListRaw(): string[];
}
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
export declare class DogOutputForDetail {
    id: number;
    name: string;
    profilePhotoUrl: string | null;
    static getFieldForDogTable(): Array<keyof Dogs>;
}
export interface JournalDetailRaw {
    id: number;
    routes: string;
    memo: string;
    journalPhotos: string;
    excrementCount: string;
}
export declare class JournalOutputForDetail {
    id: number;
    routes: [number, number][];
    memo: string;
    journalPhotos: string[];
    excrementCount: ExcrementCount[];
    static getFieldForJournalTable(): Array<keyof Journals>;
}
export declare class JournalDetailResponse {
    journalInfo: JournalOutputForDetail;
    dogs: DogOutputForDetail[];
    constructor(journalInfo: JournalOutputForDetail, dogInfo: DogOutputForDetail[]);
}
export {};
