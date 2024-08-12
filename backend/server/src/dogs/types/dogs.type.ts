import { Dogs } from '../dogs.entity';

export const GENDER = {
    Male: 'MALE',
    Female: 'FEMALE',
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

//강아지 생성
export interface CreateDogRequest {
    name: string;
    breed: string;
    gender: Gender;
    isNeutered: boolean;
    birth: string | null;
    weight: number;
    profilePhotoUrl: string | null;
}

//강아지 업데이트
export interface UpdateDogRequest {
    name?: string;
    breed?: string;
    gender?: Gender;
    isNeutered?: boolean;
    birth?: string | null;
    weight?: number;
    profilePhotoUrl?: string | null;
}

//강아지 프로필 조회
export class DogProfileResponse {
    id: number;
    name: string;
    breed: string;
    gender: Gender;
    isNeutered: boolean;
    birth: string | null;
    weight: number;
    profilePhotoUrl: string | null;

    static getFieldsForDogTableAndRaw(): Array<keyof Dogs> {
        return ['id', 'name', 'gender', 'isNeutered', 'birth', 'weight', 'profilePhotoUrl'];
    }
}

//강아지 정보 요약 조회
export class DogSummaryResponse {
    id: number;
    name: string;
    profilePhotoUrl: string | null;

    static getFieldsForDogTableAndRaw(): Array<keyof Dogs> {
        return ['id', 'name', 'profilePhotoUrl'];
    }
}
