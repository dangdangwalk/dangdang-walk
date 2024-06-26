import * as fs from 'node:fs';

import { getRandomInt } from './random.util';

import { DogWalkDay } from '../../../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../../../src/dogs/dogs.entity';
import { GENDER } from '../../../src/dogs/types/gender.type';
import { TodayWalkTime } from '../../../src/today-walk-time/today-walk-time.entity';
import { ROLE } from '../../../src/users/types/role.type';
import { Users } from '../../../src/users/users.entity';
import { UsersDogs } from '../../../src/users-dogs/users-dogs.entity';
import { generateUuid } from '../../../src/utils/hash.util';
import { OAUTH_ACCESS_TOKEN, OAUTH_REFRESH_TOKEN, VALID_REFRESH_TOKEN_100_YEARS } from '../../constants';

export function createMockUsers(n: number): Users[] {
    return Array(n)
        .fill(undefined)
        .map(
            (_, i) =>
                new Users({
                    nickname: `test-user${i + 1}#${generateUuid()}`,
                    email: `test-user${i + 1}@mail.com`,
                    profileImageUrl: 'default/profile.png',
                    role: ROLE.User,
                    mainDogId: null,
                    oauthId: (i + 1).toString(),
                    oauthAccessToken: OAUTH_ACCESS_TOKEN,
                    oauthRefreshToken: OAUTH_REFRESH_TOKEN,
                    refreshToken: VALID_REFRESH_TOKEN_100_YEARS,
                }),
        );
}

export function createMockDogsForUsers(users: Users[]): [Dogs[], UsersDogs[]] {
    const breedData = JSON.parse(fs.readFileSync('resources/breedData.json', 'utf-8'));
    const breedsLength = breedData.length;
    const dogs: Dogs[] = [];
    const usersDogs: UsersDogs[] = [];

    users.forEach((_, index) => {
        const numberOfDogs = getRandomInt({ max: 5 });

        for (let i = 0; i < numberOfDogs; i++) {
            const dog = new Dogs({
                walkDay: new DogWalkDay(),
                todayWalkTime: new TodayWalkTime(),
                name: `test-dog${dogs.length + 1}`,
                breedId: getRandomInt({ min: 1, max: breedsLength }),
                gender: GENDER.Male,
                birth: '2023-06-25',
                isNeutered: true,
                weight: 5,
                profilePhotoUrl: 'default/profile.png',
                isWalking: false,
            });

            dogs.push(dog);
            usersDogs.push(new UsersDogs({ userId: index + 1, dogId: dogs.length }));
        }
    });

    return [dogs, usersDogs];
}
