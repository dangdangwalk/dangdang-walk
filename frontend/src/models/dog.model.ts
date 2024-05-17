import { Position } from '@/models/location.model';

export interface Dog {
    id: number;
    name: string;
    profilePhotoUrl?: string;
    gender?: string;
    birth?: Date;
    breed?: string;
    isNeutered?: boolean;
    fecesLocations?: Position[];
    urineLocations?: Position[];
}

export interface WalkingDog extends Dog {
    isUrineChecked: boolean;
    isFeceChecked: boolean;
    fecesLocations: Position[];
    urineLocations: Position[];
}

export type Gender = 'MALE' | 'FEMALE' | '';

export interface DogStatistic extends Dog {
    recommendedWalkAmount: number;
    todayWalkAmount: number;
    weeklyWalks: number[];
    profilePhotoUrl: string;
}

export interface AvailableDog extends Dog {
    isChecked: boolean;
}
