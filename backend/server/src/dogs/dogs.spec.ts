import { Dogs } from './dogs.entity';

import { GENDER } from './types/dogs.type';

import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';
import { mockDog } from '../fixtures/dogs.fixture';
import { TodayWalkTime } from '../today-walk-time/today-walk-time.entity';

describe('Dogs', () => {
    it('dogs 정보가 주어지면 dogs 정보를 반환해야 한다.', () => {
        expect(mockDog).toEqual({
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
            updatedAt: expect.any(Date),
        });
    });

    it('dogs 정보가 없으면 빈 객체를 반환해야 한다.', () => {
        const breed = new Dogs({});

        expect(breed).toEqual({});
    });
});
