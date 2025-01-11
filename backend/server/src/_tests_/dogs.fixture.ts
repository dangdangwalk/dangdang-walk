import { DogWalkDay } from 'applications/dog-walk-day/dog-walk-day.entity';

import { TodayWalkTime } from 'applications/today-walk-time/today-walk-time.entity';

import { Dogs } from '../applications/dogs/dogs.entity';
import { GENDER } from '../applications/dogs/types/dogs.type';

export const mockDog = new Dogs({
    id: 1,
    walkDay: new DogWalkDay({}),
    todayWalkTime: new TodayWalkTime({}),
    name: '덕지',
    breedId: 1,
    gender: GENDER.Male,
    birth: null,
    isNeutered: true,
    weight: 2,
    profilePhotoUrl: 'default/profile.png',
    isWalking: false,
    updatedAt: new Date('2019-01-01'),
});

export const mockDogProfile = {
    id: 1,
    name: '덕지',
    breed: '아펜핀셔',
    gender: 'MALE',
    isNeutered: true,
    birth: null,
    weight: 2,
    profilePhotoUrl: 'default/profile.png',
};

export const mockDog2 = new Dogs({
    id: 2,
    walkDay: new DogWalkDay({}),
    todayWalkTime: new TodayWalkTime({}),
    name: '루이',
    breedId: 2,
    gender: GENDER.Female,
    birth: null,
    isNeutered: false,
    weight: 1,
    profilePhotoUrl: 'default/profile.png',
    isWalking: false,
    updatedAt: new Date('2019-01-01'),
});

export const mockDog2Profile = {
    id: 2,
    name: '루이',
    breed: '아프간 하운드',
    gender: 'FEMALE',
    isNeutered: false,
    birth: null,
    weight: 1,
    profilePhotoUrl: 'default/profile.png',
};
