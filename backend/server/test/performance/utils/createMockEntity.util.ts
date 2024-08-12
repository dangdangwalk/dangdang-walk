import * as fs from 'node:fs';

import { DataSource } from 'server/src/node_modules/typeorm';

import { getObjectValue, getRandomElements, getRandomInt, getRandomPastDate } from './random.util';

import { GENDER } from '../../../server/src/dogs/types/gender.type';
import { JournalPhotos } from '../../../server/src/journal-photos/journal-photos.entity';
import { DogWalkDay } from '../../../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../../../src/dogs/dogs.entity';
import { Excrements } from '../../../src/excrements/excrements.entity';
import { EXCREMENT } from '../../../src/excrements/types/excrement.type';
import { Journals } from '../../../src/journals/journals.entity';
import { JournalsDogs } from '../../../src/journals-dogs/journals-dogs.entity';
import { TodayWalkTime } from '../../../src/today-walk-time/today-walk-time.entity';
import { ROLE } from '../../../src/users/types/role.type';
import { Users } from '../../../src/users/users.entity';
import { UsersDogs } from '../../../src/users-dogs/users-dogs.entity';
import { generateUuid } from '../../../src/utils/hash.util';
import { OAUTH_ACCESS_TOKEN, OAUTH_REFRESH_TOKEN, VALID_REFRESH_TOKEN_100_YEARS } from '../../constants';

interface ConsoleTableRowFormat {
    Entity: string;
    Count: number;
}

interface UserWithDogs {
    userId: number;
    dogIds: number[];
}

export class CreateMockEntity {
    users: Users[] = [];
    dogs: Dogs[] = [];
    usersDogs: UsersDogs[] = [];
    journals: Journals[] = [];
    journalsDogs: JournalsDogs[] = [];
    journalPhotos: JournalPhotos[] = [];
    excrements: Excrements[] = [];

    constructor(
        private readonly dataSource: DataSource,
        private readonly n: number,
    ) {}

    async createMockUsers(): Promise<ConsoleTableRowFormat[]> {
        this.users = Array.from({ length: this.n }).map(
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

        await this.dataSource
            .createQueryBuilder(Users, 'users')
            .insert()
            .values(this.users)
            .updateEntity(false)
            .execute();

        return [{ Entity: 'Users', Count: this.users.length }];
    }

    async createMockDogs(): Promise<ConsoleTableRowFormat[]> {
        const breedData = JSON.parse(fs.readFileSync('resources/breedData.json', 'utf-8'));
        const breedsLength = breedData.length;

        for (let userId = 1; userId <= this.n; userId++) {
            const numberOfDogs = getRandomInt({ max: 5 });

            for (let i = 0; i < numberOfDogs; i++) {
                const dog = new Dogs({
                    walkDayId: this.dogs.length + 1,
                    todayWalkTimeId: this.dogs.length + 1,
                    name: `test-dog${this.dogs.length + 1}`,
                    breedId: getRandomInt({ min: 1, max: breedsLength }),
                    gender: GENDER.Male,
                    birth: '2023-06-25',
                    isNeutered: true,
                    weight: 5,
                    profilePhotoUrl: 'default/profile.png',
                    isWalking: false,
                });

                this.dogs.push(dog);
                this.usersDogs.push(new UsersDogs({ userId, dogId: this.dogs.length }));
            }
        }

        await Promise.all([
            this.dataSource.createQueryBuilder(Dogs, 'dogs').insert().values(this.dogs).updateEntity(false).execute(),
            this.dataSource
                .createQueryBuilder(UsersDogs, 'usersDogs')
                .insert()
                .values(this.usersDogs)
                .updateEntity(false)
                .execute(),
            this.dataSource
                .createQueryBuilder(DogWalkDay, 'dogWalkDay')
                .insert()
                .values(Array(this.dogs.length).fill(new DogWalkDay({})))
                .updateEntity(false)
                .execute(),
            this.dataSource
                .createQueryBuilder(TodayWalkTime, 'todayWalkTime')
                .insert()
                .values(Array(this.dogs.length).fill(new TodayWalkTime({})))
                .updateEntity(false)
                .execute(),
        ]);

        return [
            { Entity: 'Dogs', Count: this.dogs.length },
            { Entity: 'UserDogs', Count: this.usersDogs.length },
        ];
    }

    private async getUsersWithDogs(): Promise<UserWithDogs[]> {
        return this.dataSource
            .createQueryBuilder(UsersDogs, 'usersDogs')
            .select('usersDogs.user_id', 'userId')
            .addSelect('JSON_ARRAYAGG(usersDogs.dog_id)', 'dogIds')
            .groupBy('usersDogs.user_id')
            .getRawMany();
    }

    async createMockJournals(): Promise<ConsoleTableRowFormat[]> {
        const usersWithDogs = await this.getUsersWithDogs();

        let journalId = 0;
        for (const { userId, dogIds } of usersWithDogs) {
            const numberOfJournals = getRandomInt({ max: 50 });
            const photoUrls = [`${userId}/photo1.jpeg`, `${userId}/photo2.png`];

            for (let i = 0; i < numberOfJournals; i++) {
                journalId++;

                const journal = new Journals({
                    userId,
                    routes: '[{"lat": 87.4, "lng" : 85.222}, {"lat": 75.23, "lng" : 104.4839}]',
                    calories: 500,
                    memo: 'Enjoyed the walk with Buddy!',
                    startedAt: getRandomPastDate({ days: 30 }),
                    duration: 30,
                    distance: 5,
                });

                const walkDogIds = getRandomElements(dogIds);
                const walkPhotos = getRandomElements(photoUrls);

                const journalDogs = walkDogIds.map((dogId) => new JournalsDogs({ dogId, journalId }));
                const journalPhotos = walkPhotos.map((photoUrl) => new JournalPhotos({ photoUrl, journalId }));

                const excrements: Excrements[] = [];
                walkDogIds.forEach((dogId) => {
                    excrements.push(
                        new Excrements({
                            journalId,
                            dogId,
                            type: getObjectValue(EXCREMENT),
                            coordinate: `POINT(87.4 85.222)`,
                        }),
                    );
                });

                this.journals.push(journal);
                this.journalsDogs.push(...journalDogs);
                this.journalPhotos.push(...journalPhotos);
                this.excrements.push(...excrements);
            }
        }

        await Promise.all([
            this.dataSource.getRepository(Journals).insert(this.journals),
            this.dataSource.getRepository(JournalsDogs).insert(this.journalsDogs),
            this.dataSource.getRepository(JournalPhotos).insert(this.journalPhotos),
            this.dataSource.getRepository(Excrements).insert(this.excrements),
        ]);

        return [
            { Entity: 'Journals', Count: this.journals.length },
            { Entity: 'JournalsDogs', Count: this.journalsDogs.length },
            { Entity: 'JournalPhotos', Count: this.journalPhotos.length },
            { Entity: 'Excrements', Count: this.excrements.length },
        ];
    }
}
