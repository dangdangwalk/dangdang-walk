import { Gender } from './types/dogs.type';
import { Breed } from '../breed/breed.entity';
import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';
import { TodayWalkTime } from '../today-walk-time/today-walk-time.entity';
export declare class Dogs {
    id: number;
    walkDay: DogWalkDay;
    walkDayId: number;
    todayWalkTime: TodayWalkTime;
    todayWalkTimeId: number;
    name: string;
    breed: Breed;
    breedId: number;
    gender: Gender;
    birth: string | null;
    isNeutered: boolean;
    weight: number;
    profilePhotoUrl: string | null;
    isWalking: boolean;
    updatedAt: Date;
    constructor(entityData: Partial<Dogs>);
}
