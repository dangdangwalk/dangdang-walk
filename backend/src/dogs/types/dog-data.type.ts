import { Gender } from './gender.type';

export interface DogData {
    name: string;
    breed: string;
    gender: Gender;
    isNeutered: boolean;
    birth: string | null;
    weight: number;
    profilePhotoUrl: string | null;
}
