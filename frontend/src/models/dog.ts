import { Coords } from '@/models/location';

export interface Dog {
    id: number;
    name: string;
    profilePhotoUrl: string | null;
    gender: string;
    birth: string | null;
    breed: string;
    isNeutered: boolean;
    weight: number;
}

export type DogAvatar = Pick<Dog, 'id' | 'name' | 'profilePhotoUrl'>;
export interface WalkingDog extends DogAvatar {
    isUrineChecked: boolean;
    isFecesChecked: boolean;
    fecesLocations: Coords[];
    urineLocations: Coords[];
}

export type Gender = 'MALE' | 'FEMALE' | '';

export interface DogStatistic extends DogAvatar {
    recommendedWalkAmount: number;
    todayWalkAmount: number;
    weeklyWalks: number[];
    profilePhotoUrl: string;
}

export type DogCreateForm = Omit<Dog, 'id'>;
