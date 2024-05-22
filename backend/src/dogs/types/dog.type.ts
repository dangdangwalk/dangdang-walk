export const GENDER = {
    Male: 'MALE',
    Female: 'FEMALE',
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export interface DogProfile {
    id: number;
    name: string;
    breed: string;
    gender: Gender;
    isNeutered: boolean;
    birth: string | null;
    weight: number;
    profilePhotoUrl: string | null;
}

export interface DogSummary {
    id: number;
    name: string;
    profilePhotoUrl: string | null;
}

export interface DogData {
    name: string;
    breed: string;
    gender: Gender;
    isNeutered: boolean;
    birth: string | null;
    weight: number;
    profilePhotoUrl: string | null;
}
