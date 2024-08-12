import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';

export const mockDogWalkDays = [
    {
        id: 1,
        mon: 2,
        tue: 1,
        wed: 3,
        thr: 0,
        fri: 4,
        sat: 2,
        sun: 1,
        updatedAt: new Date('2023-06-01T10:00:00Z'),
    },
    {
        id: 2,
        mon: 1,
        tue: 2,
        wed: 1,
        thr: 3,
        fri: 2,
        sat: 1,
        sun: 0,
        updatedAt: new Date('2023-06-02T12:00:00Z'),
    },
];

export const mockDogWalkDay: DogWalkDay = {
    id: 1,
    mon: 1,
    tue: 2,
    wed: 1,
    thr: 3,
    fri: 2,
    sat: 1,
    sun: 0,
    updatedAt: new Date('2023-06-02T12:00:00Z'),
};
