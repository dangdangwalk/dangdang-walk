import { Gender } from '../types/dogs.type';
export declare class CreateDogDto {
    name: string;
    breed: string;
    gender: Gender;
    isNeutered: boolean;
    birth: string | null;
    weight: number;
    profilePhotoUrl: string | null;
}
