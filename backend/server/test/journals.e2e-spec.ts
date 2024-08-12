import * as request from 'supertest';

import {
    OAUTH_ACCESS_TOKEN,
    OAUTH_REFRESH_TOKEN,
    VALID_ACCESS_TOKEN_100_YEARS,
    VALID_REFRESH_TOKEN_100_YEARS,
} from './constants';

import {
    clearDogs,
    clearFakeDate,
    clearJournal,
    clearJournals,
    clearUsers,
    closeTestApp,
    insertMockDogs,
    insertMockJournalWithPhotosAndExcrements,
    insertMockJournals,
    insertMockUsers,
    setFakeDate,
    setupTestApp,
    testUnauthorizedAccess,
} from './test-utils';

import { INestApplication } from '../node_modules/@nestjs/common';
import { DataSource } from '../node_modules/typeorm';

import { DogWalkDay } from '../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../src/dogs/dogs.entity';
import { GENDER } from '../src/dogs/types/dogs.type';
import { Excrements } from '../src/excrements/excrements.entity';
import { Journals } from '../src/journals/journals.entity';
import { JournalsDogs } from '../src/journals-dogs/journals-dogs.entity';
import { TodayWalkTime } from '../src/today-walk-time/today-walk-time.entity';
import { ROLE } from '../src/users/types/role.type';
import { Users } from '../src/users/users.entity';

describe('JournalsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        ({ app, dataSource } = await setupTestApp());
        await insertMockUsers({
            mockUsers: new Users({
                id: 1,
                nickname: 'mock_oauth_nickname#12345',
                email: 'mock_email@example.com',
                profileImageUrl: 'mock_profile_image.jpg',
                role: ROLE.User,
                mainDogId: null,
                oauthId: '12345',
                oauthAccessToken: OAUTH_ACCESS_TOKEN,
                oauthRefreshToken: OAUTH_REFRESH_TOKEN,
                refreshToken: VALID_REFRESH_TOKEN_100_YEARS,
                createdAt: new Date('2019-01-01'),
            }),
        });
    });

    afterAll(async () => {
        await clearUsers();
        await closeTestApp();
    });

    describe('/journals (GET)', () => {
        context('사용자가 산책을 하지 않은 날의 산책 일지 목록 조회 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs({
                    mockDogs: new Dogs({
                        id: 1,
                        walkDay: new DogWalkDay({}),
                        todayWalkTime: new TodayWalkTime({}),
                        name: '덕지',
                        breedId: 1,
                        gender: GENDER.Male,
                        birth: null,
                        isNeutered: true,
                        weight: 2,
                        profilePhotoUrl: 'mock_profile_photo.jpg',
                        isWalking: false,
                        updatedAt: new Date('2019-01-01'),
                    }),
                    userId: 1,
                });
            });

            afterEach(async () => {
                await clearDogs();
            });

            it('200 상태 코드와 빈 배열을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/journals?dogId=1&date=2024-06-10')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual([]);
            });
        });

        context('사용자가 산책 일지 목록 조회 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs({
                    mockDogs: [
                        new Dogs({
                            id: 1,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '덕지',
                            breedId: 1,
                            gender: GENDER.Male,
                            birth: null,
                            isNeutered: true,
                            weight: 2,
                            profilePhotoUrl: 'mock_profile_photo.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                        new Dogs({
                            id: 2,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '루이',
                            breedId: 2,
                            gender: GENDER.Female,
                            birth: null,
                            isNeutered: false,
                            weight: 1,
                            profilePhotoUrl: 'mock_profile_photo2.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                    ],
                    userId: 1,
                });
                await insertMockJournals({
                    mockJournals: [
                        new Journals({
                            id: 1,
                            userId: 1,
                            routes: JSON.stringify([
                                [87.4, 85.222],
                                [75.23, 104.4839],
                            ]),
                            calories: 500,
                            memo: '좋은 날씨',
                            startedAt: new Date('2024-05-05T10:00:00Z'),
                            journalPhotos: JSON.stringify(['1/test.jpg']),
                            duration: 30,
                            distance: 2000,
                            excrementCount: JSON.stringify([
                                {
                                    dogId: 1,
                                    fecesCnt: 1,
                                    urineCnt: 1,
                                },
                                {
                                    dogId: 2,
                                    fecesCnt: 2,
                                    urineCnt: 0,
                                },
                            ]),
                        }),
                        new Journals({
                            id: 2,
                            userId: 1,
                            routes: JSON.stringify([
                                [87.4, 85.222],
                                [75.23, 104.4839],
                            ]),
                            calories: 700,
                            startedAt: new Date('2024-05-07T12:00:00Z'),
                            journalPhotos: JSON.stringify(['1/test.jpg']),
                            duration: 60,
                            distance: 3000,
                            excrementCount: JSON.stringify([
                                {
                                    dogId: 1,
                                    fecesCnt: 1,
                                    urineCnt: 1,
                                },
                                {
                                    dogId: 2,
                                    fecesCnt: 2,
                                    urineCnt: 0,
                                },
                            ]),
                        }),
                        new Journals({
                            id: 3,
                            userId: 1,
                            routes: JSON.stringify([
                                [87.4, 85.222],
                                [75.23, 104.4839],
                            ]),
                            calories: 1200,
                            memo: '산책 중에 친구 만남',
                            startedAt: new Date('2024-05-09T17:00:00Z'),
                            journalPhotos: JSON.stringify(['1/test.jpg']),
                            duration: 135,
                            distance: 5500,
                            excrementCount: JSON.stringify([
                                {
                                    dogId: 1,
                                    fecesCnt: 1,
                                    urineCnt: 1,
                                },
                                {
                                    dogId: 2,
                                    fecesCnt: 2,
                                    urineCnt: 0,
                                },
                            ]),
                        }),
                        new Journals({
                            id: 4,
                            userId: 1,
                            routes: JSON.stringify([
                                [87.4, 85.222],
                                [75.23, 104.4839],
                            ]),
                            calories: 1300,
                            memo: '산책 후 독서',
                            startedAt: new Date('2024-05-09T18:00:00Z'),
                            journalPhotos: JSON.stringify(['1/test.jpg']),
                            duration: 150,
                            distance: 6000,
                            excrementCount: JSON.stringify([
                                {
                                    dogId: 1,
                                    fecesCnt: 1,
                                    urineCnt: 1,
                                },
                                {
                                    dogId: 2,
                                    fecesCnt: 2,
                                    urineCnt: 0,
                                },
                            ]),
                        }),
                    ],
                    dogId: 1,
                });
            });

            afterEach(async () => {
                await clearJournals();
                await clearDogs();
            });

            const expectJournals = [
                {
                    journalId: 3,
                    calories: 1200,
                    startedAt: expect.any(String),
                    duration: 135,
                    distance: 5500,
                    journalCnt: 3,
                },
                {
                    journalId: 4,
                    calories: 1300,
                    startedAt: expect.any(String),
                    duration: 150,
                    distance: 6000,
                    journalCnt: 4,
                },
            ];

            it('200 상태 코드와 산책 일지 목록을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/journals?dogId=1&date=2024-05-10')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual(expectJournals);
            });
        });

        context('사용자가 소유하지 않은 강아지로 산책 일지 목록 조회 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?dogId=1&date=2024-06-11')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        context('dogId query 없이 산책 일지 목록 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?date=2024-06-11')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('유효하지 않은 dogId query로 산책 일지 목록 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?dogId=test&date=2024-06-11')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('date query 없이 산책 일지 목록 조회 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs({
                    mockDogs: [
                        new Dogs({
                            id: 1,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '덕지',
                            breedId: 1,
                            gender: GENDER.Male,
                            birth: null,
                            isNeutered: true,
                            weight: 2,
                            profilePhotoUrl: 'mock_profile_photo.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                        new Dogs({
                            id: 2,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '루이',
                            breedId: 2,
                            gender: GENDER.Female,
                            birth: null,
                            isNeutered: false,
                            weight: 1,
                            profilePhotoUrl: 'mock_profile_photo2.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                    ],
                    userId: 1,
                });
            });

            afterEach(async () => {
                await clearDogs();
            });

            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?dogId=1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('YYYY-MM-DD 형식이 아닌 date query로 산책 일지 목록 조회 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs({
                    mockDogs: new Dogs({
                        id: 1,
                        walkDay: new DogWalkDay({}),
                        todayWalkTime: new TodayWalkTime({}),
                        name: '덕지',
                        breedId: 1,
                        gender: GENDER.Male,
                        birth: null,
                        isNeutered: true,
                        weight: 2,
                        profilePhotoUrl: 'mock_profile_photo.jpg',
                        isWalking: false,
                        updatedAt: new Date('2019-01-01'),
                    }),
                    userId: 1,
                });
            });

            afterEach(async () => {
                await clearDogs();
            });

            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?dogId=1&date=20240611')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        testUnauthorizedAccess('산책 일지 목록 조회', 'get', '/journals');
    });

    describe('/journals (POST)', () => {
        context('사용자가 산책 일지 생성 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs({
                    mockDogs: [
                        new Dogs({
                            id: 1,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '덕지',
                            breedId: 1,
                            gender: GENDER.Male,
                            birth: null,
                            isNeutered: true,
                            weight: 2,
                            profilePhotoUrl: 'mock_profile_photo.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                        new Dogs({
                            id: 2,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '루이',
                            breedId: 2,
                            gender: GENDER.Female,
                            birth: null,
                            isNeutered: false,
                            weight: 1,
                            profilePhotoUrl: 'mock_profile_photo2.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                    ],
                    userId: 1,
                });
            });

            afterEach(async () => {
                await clearJournal({ dogIds: [1, 2] });
                await clearDogs();
            });

            const createJournalMock = {
                dogs: [1, 2],
                journalInfo: {
                    distance: 5,
                    calories: 500,
                    startedAt: '2024-06-12T00:00:00Z',
                    duration: 3600,
                    routes: [
                        [87.4, 85.222],
                        [75.23, 104.4839],
                    ],
                    journalPhotos: ['1/photo1.jpeg', '1/photo2.png'],
                    memo: 'Enjoyed the walk with Buddy!',
                },
                excrements: [
                    {
                        dogId: 1,
                        fecesLocations: [[87.4, 85.222]],
                        urineLocations: [[87.4, 85.222]],
                    },
                    {
                        dogId: 2,
                        fecesLocations: [[75.23, 104.4839]],
                        urineLocations: [],
                    },
                ],
            };

            it('201 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .post('/journals')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(createJournalMock)
                    .expect(201);

                expect(await dataSource.getRepository(Journals).count()).toBe(1);
                expect(await dataSource.getRepository(JournalsDogs).count()).toBe(2);
                expect(await dataSource.getRepository(Excrements).count({ where: { dogId: 1 } })).toBe(2);
                expect(await dataSource.getRepository(Excrements).count({ where: { dogId: 2 } })).toBe(1);

                const today = new Date();
                const dayOfWeek = today.getDay();
                const days = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
                const todayString = days[dayOfWeek];

                const dog1WalkDay = await dataSource
                    .getRepository(DogWalkDay)
                    .findOne({ where: { id: 1 }, select: days });
                if (!dog1WalkDay) throw new Error('id가 1인 산책일지를 찾을 수 없습니다');

                const dog2WalkDay = await dataSource
                    .getRepository(DogWalkDay)
                    .findOne({ where: { id: 2 }, select: days });
                if (!dog2WalkDay) throw new Error('id가 2인 산책일지를 찾을 수 없습니다');

                const expectedWalkDays = {
                    mon: 0,
                    tue: 0,
                    wed: 0,
                    thr: 0,
                    fri: 0,
                    sat: 0,
                    sun: 0,
                    [todayString]: 1,
                };

                expect(dog1WalkDay).toEqual(expectedWalkDays);
                expect(dog2WalkDay).toEqual(expectedWalkDays);
            });
        });

        context('사용자가 소유하지 않은 강아지가 포함된 산책 일지 생성 요청을 보내면', () => {
            const createJournalMock = {
                dogs: [1, 2],
                journalInfo: {
                    distance: 5,
                    calories: 500,
                    startedAt: '2024-06-12T00:00:00Z',
                    duration: 3600,
                    routes: [
                        [87.4, 85.222],
                        [75.23, 104.4839],
                    ],
                    journalPhotos: ['1/photo1.jpeg', '1/photo2.png'],
                    memo: 'Enjoyed the walk with Buddy!',
                },
                excrements: [
                    {
                        dogId: 1,
                        fecesLocations: [{ lat: '87.4', lng: '85.222' }],
                        urineLocations: [{ lat: '87.4', lng: '85.222' }],
                    },
                    {
                        dogId: 2,
                        fecesLocations: [{ lat: '75.23', lng: '104.4839' }],
                        urineLocations: [],
                    },
                ],
            };

            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/journals')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(createJournalMock)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('산책 일지 생성', 'post', '/journals');
    });

    describe('/journals/:id (GET)', () => {
        context('사용자가 자신이 소유한 산책 일지의 상세 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs({
                    mockDogs: [
                        new Dogs({
                            id: 1,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '덕지',
                            breedId: 1,
                            gender: GENDER.Male,
                            birth: null,
                            isNeutered: true,
                            weight: 2,
                            profilePhotoUrl: 'mock_profile_photo.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                        new Dogs({
                            id: 2,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '루이',
                            breedId: 2,
                            gender: GENDER.Female,
                            birth: null,
                            isNeutered: false,
                            weight: 1,
                            profilePhotoUrl: 'mock_profile_photo2.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                    ],
                    userId: 1,
                });
                await insertMockJournalWithPhotosAndExcrements({
                    mockJournal: new Journals({
                        id: 1,
                        userId: 1,
                        routes: JSON.stringify([
                            [87.4, 85.222],
                            [75.23, 104.4839],
                        ]),
                        calories: 500,
                        memo: 'Enjoyed the walk with Buddy!',
                        startedAt: new Date('2024-06-12T00:00:00Z'),
                        journalPhotos: JSON.stringify(['1/photo1.jpeg', '1/photo2.png']),
                        duration: 30,
                        distance: 5,
                        excrementCount: JSON.stringify([
                            {
                                dogId: 1,
                                fecesCnt: 1,
                                urineCnt: 1,
                            },
                            {
                                dogId: 2,
                                fecesCnt: 2,
                                urineCnt: 0,
                            },
                        ]),
                    }),
                    dogIds: [1, 2],
                });
            });

            afterEach(async () => {
                await clearJournal({ dogIds: [1, 2] });
                await clearDogs();
            });

            const expectDetail = {
                journalInfo: {
                    id: 1,
                    routes: [
                        [87.4, 85.222],
                        [75.23, 104.4839],
                    ],
                    memo: 'Enjoyed the walk with Buddy!',
                    journalPhotos: ['1/photo1.jpeg', '1/photo2.png'],
                    excrementCount: [
                        {
                            dogId: 1,
                            fecesCnt: 1,
                            urineCnt: 1,
                        },
                        {
                            dogId: 2,
                            fecesCnt: 2,
                            urineCnt: 0,
                        },
                    ],
                },
                dogs: [
                    {
                        id: 1,
                        name: '덕지',
                        profilePhotoUrl: 'mock_profile_photo.jpg',
                    },
                    {
                        id: 2,
                        name: '루이',
                        profilePhotoUrl: 'mock_profile_photo2.jpg',
                    },
                ],
            };

            it('200 상태 코드와 산책 일지 상세 정보를 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/journals/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual(expectDetail);
            });
        });

        context('사용자가 자신이 소유하지 않은 산책 일지의 상세 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('산책 일지 상세', 'get', '/journals/1');
    });

    describe('/journals/:id (PATCH)', () => {
        context('사용자가 자신이 소유한 산책 일지의 정보 수정 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs({
                    mockDogs: [
                        new Dogs({
                            id: 1,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '덕지',
                            breedId: 1,
                            gender: GENDER.Male,
                            birth: null,
                            isNeutered: true,
                            weight: 2,
                            profilePhotoUrl: 'mock_profile_photo.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                        new Dogs({
                            id: 2,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '루이',
                            breedId: 2,
                            gender: GENDER.Female,
                            birth: null,
                            isNeutered: false,
                            weight: 1,
                            profilePhotoUrl: 'mock_profile_photo2.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                    ],
                    userId: 1,
                });
                await insertMockJournalWithPhotosAndExcrements({
                    mockJournal: new Journals({
                        id: 1,
                        userId: 1,
                        routes: JSON.stringify([
                            [87.4, 85.222],
                            [75.23, 104.4839],
                        ]),
                        calories: 500,
                        memo: 'Enjoyed the walk with Buddy!',
                        startedAt: new Date('2024-06-12T00:00:00Z'),
                        journalPhotos: JSON.stringify(['1/photo1.jpeg', '1/photo2.png']),
                        duration: 30,
                        distance: 5,
                        excrementCount: JSON.stringify([
                            {
                                dogId: 1,
                                fecesCnt: 1,
                                urineCnt: 1,
                            },
                            {
                                dogId: 2,
                                fecesCnt: 2,
                                urineCnt: 0,
                            },
                        ]),
                    }),
                    dogIds: [1, 2],
                });
            });

            afterEach(async () => {
                await clearJournal({ dogIds: [1, 2] });
                await clearDogs();
            });

            const updateJournalMock = {
                memo: '메모 수정',
                journalPhotos: ['1/photo1.png', '1/photo2.jpeg'],
            };

            it('204 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .patch('/journals/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(updateJournalMock)
                    .expect(204);

                const updatedJournal = await dataSource.getRepository(Journals).findOne({ where: { id: 1 } });
                if (!updatedJournal) throw new Error('id가 1인 산책일지를 찾을 수 없습니다');

                expect(updatedJournal.memo).toBe(updateJournalMock.memo);
                expect(JSON.parse(updatedJournal.journalPhotos)).toEqual(updateJournalMock.journalPhotos);
            });
        });

        context('사용자가 자신이 소유하지 않은 산책 일지의 정보 수정 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .patch('/journals/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('산책 일지 정보 수정', 'patch', '/journals/1');
    });

    describe('/journals/:id (DELETE)', () => {
        context('사용자가 자신이 소유한 산책 일지의 삭제 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs({
                    mockDogs: [
                        new Dogs({
                            id: 1,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '덕지',
                            breedId: 1,
                            gender: GENDER.Male,
                            birth: null,
                            isNeutered: true,
                            weight: 2,
                            profilePhotoUrl: 'mock_profile_photo.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                        new Dogs({
                            id: 2,
                            walkDay: new DogWalkDay({}),
                            todayWalkTime: new TodayWalkTime({}),
                            name: '루이',
                            breedId: 2,
                            gender: GENDER.Female,
                            birth: null,
                            isNeutered: false,
                            weight: 1,
                            profilePhotoUrl: 'mock_profile_photo2.jpg',
                            isWalking: false,
                            updatedAt: new Date('2019-01-01'),
                        }),
                    ],
                    userId: 1,
                });
                await insertMockJournalWithPhotosAndExcrements({
                    mockJournal: new Journals({
                        id: 1,
                        userId: 1,
                        routes: '[{"lat": 87.4, "lng" : 85.222}, {"lat": 75.23, "lng" : 104.4839}]',
                        calories: 500,
                        memo: 'Enjoyed the walk with Buddy!',
                        startedAt: new Date('2024-06-12T00:00:00Z'),
                        journalPhotos: '[]',
                        duration: 30,
                        distance: 5,
                        excrementCount: JSON.stringify([
                            {
                                dogId: 1,
                                fecesCnt: 1,
                                urineCnt: 1,
                            },
                            {
                                dogId: 2,
                                fecesCnt: 2,
                                urineCnt: 0,
                            },
                        ]),
                    }),
                    dogIds: [1, 2],
                });
                const fakeDate = new Date('2024-06-12T00:00:00Z');
                setFakeDate(fakeDate);
            });

            afterEach(async () => {
                clearFakeDate();
                await clearJournal({ dogIds: [1, 2] });
                await clearDogs();
            });

            it('204 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .delete('/journals/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(204);

                expect(await dataSource.getRepository(Journals).count()).toBe(0);

                const days = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];

                const dog1WalkDay = await dataSource
                    .getRepository(DogWalkDay)
                    .findOne({ where: { id: 1 }, select: days });
                if (!dog1WalkDay) throw new Error('id가 1인 산책일지를 찾을 수 없습니다');

                const dog2WalkDay = await dataSource
                    .getRepository(DogWalkDay)
                    .findOne({ where: { id: 2 }, select: days });
                if (!dog2WalkDay) throw new Error('id가 2인 산책일지를 찾을 수 없습니다');

                const expectedWalkDays = {
                    mon: 0,
                    tue: 0,
                    wed: 0,
                    thr: 0,
                    fri: 0,
                    sat: 0,
                    sun: 0,
                };

                expect(dog1WalkDay).toEqual(expectedWalkDays);
                expect(dog2WalkDay).toEqual(expectedWalkDays);
            });
        });

        context('사용자가 자신이 소유하지 않은 산책 일지의 삭제 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .delete('/journals/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('산책 일지 삭제', 'delete', '/journals/1');
    });
});
