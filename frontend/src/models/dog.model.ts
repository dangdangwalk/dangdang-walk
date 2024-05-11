import { Position } from '@/models/location.model';

export interface Dog {
    id: number;
    name: string;
    photoUrl?: string;
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

export type Gender = 'MALE' | 'FEMALE' | null;
