import * as fs from 'node:fs';

import { getRandomInt, getRandomPastDate } from './random.util';

import { DogWalkDay } from '../../../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../../../src/dogs/dogs.entity';
import { GENDER } from '../../../src/dogs/types/gender.type';
import { TodayWalkTime } from '../../../src/today-walk-time/today-walk-time.entity';
import { ROLE } from '../../../src/users/types/role.type';
import { Users } from '../../../src/users/users.entity';
import { UsersDogs } from '../../../src/users-dogs/users-dogs.entity';
import { formatDate } from '../../../src/utils/date.util';
import { generateUuid } from '../../../src/utils/hash.util';
import { OAUTH_ACCESS_TOKEN, OAUTH_REFRESH_TOKEN, VALID_REFRESH_TOKEN_100_YEARS } from '../../constants';

export function createMockUsers(n: number): Users[] {
    return Array(n)
        .fill(undefined)
        .map(
            (_, i) =>
                new Users({
                    nickname: `${i + 1}#${generateUuid()}`,
                    email: `test${i + 1}@mail.com`,
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
        const numberOfDogs = getRandomInt(0, 5);

        for (let i = 0; i < numberOfDogs; i++) {
            const dog = new Dogs({
                walkDay: new DogWalkDay(),
                todayWalkTime: new TodayWalkTime(),
                name: `강아지 ${dogs.length + 1}`,
                breedId: getRandomInt(1, breedsLength),
                gender: Math.random() < 0.5 ? GENDER.Male : GENDER.Female,
                birth: Math.random() < 0.5 ? null : formatDate(getRandomPastDate(365 * 15)),
                isNeutered: Math.random() < 0.5,
                weight: getRandomInt(1, 50),
                profilePhotoUrl: 'mock_profile_photo.jpg',
                isWalking: false,
            });

            dogs.push(dog);
            usersDogs.push(new UsersDogs({ userId: index + 1, dogId: dogs.length }));
        }
    });

    return [dogs, usersDogs];
}
