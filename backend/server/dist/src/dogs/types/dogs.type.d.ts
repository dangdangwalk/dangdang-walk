import { Dogs } from '../dogs.entity';
export declare const GENDER: {
    readonly Male: 'MALE';
    readonly Female: 'FEMALE';
};
export type Gender = (typeof GENDER)[keyof typeof GENDER];
export interface CreateDogRequest {
    name: string;
    breed: string;
    gender: Gender;
    isNeutered: boolean;
    birth: string | null;
    weight: number;
    profilePhotoUrl: string | null;
}
export interface UpdateDogRequest {
    name?: string;
    breed?: string;
    gender?: Gender;
    isNeutered?: boolean;
    birth?: string | null;
    weight?: number;
    profilePhotoUrl?: string | null;
}
export declare class DogProfileResponse {
    id: number;
    name: string;
    breed: string;
    gender: Gender;
    isNeutered: boolean;
    birth: string | null;
    weight: number;
    profilePhotoUrl: string | null;
    static getFieldsForDogTableAndRaw(): Array<keyof Dogs>;
}
export declare class DogSummaryResponse {
    id: number;
    name: string;
    profilePhotoUrl: string | null;
    static getFieldsForDogTableAndRaw(): Array<keyof Dogs>;
}
