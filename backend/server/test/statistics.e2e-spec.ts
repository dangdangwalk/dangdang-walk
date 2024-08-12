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
    clearJournals,
    clearUsers,
    closeTestApp,
    insertMockDogs,
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
import { Journals } from '../src/journals/journals.entity';
import { TodayWalkTime } from '../src/today-walk-time/today-walk-time.entity';
import { ROLE } from '../src/users/types/role.type';
import { Users } from '../src/users/users.entity';

describe('StatisticsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        ({ app, dataSource } = await setupTestApp());
    });

    beforeEach(async () => {
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
                        [60.7749, 120.4839],
                        [60.7749, 104.4839],
                    ]),
                    calories: 500,
                    memo: '좋은 날씨',
                    startedAt: new Date('2024-05-05T10:00:00Z'),
                    journalPhotos: JSON.stringify(['1/238723740234.jpg']),
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
                        [60.7749, 120.4839],
                        [60.7749, 104.4839],
                    ]),
                    calories: 700,
                    startedAt: new Date('2024-05-07T12:00:00Z'),
                    journalPhotos: JSON.stringify(['1/238723740234.jpg']),
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
                        [60.7749, 120.4839],
                        [60.7749, 104.4839],
                    ]),
                    calories: 1200,
                    memo: '산책 중에 친구 만남',
                    startedAt: new Date('2024-05-09T17:00:00Z'),
                    journalPhotos: JSON.stringify(['1/238723740234.jpg']),
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
                        [60.7749, 120.4839],
                        [60.7749, 104.4839],
                    ]),
                    calories: 1300,
                    memo: '산책 후 독서',
                    startedAt: new Date('2024-05-09T18:00:00Z'),
                    journalPhotos: JSON.stringify(['1/238723740234.jpg']),
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
        await clearUsers();
    });

    afterAll(async () => {
        await closeTestApp();
    });

    describe('/dogs/:id/statistics/recent (GET)', () => {
        context('사용자가 소유한 강아지의 최근 한달 간 산책 통계 조회 요청을 보내면', () => {
            beforeEach(() => {
                const fakeDate = new Date('2024-06-01T00:00:00Z');
                setFakeDate(fakeDate);
            });

            afterEach(() => {
                clearFakeDate();
            });

            it('200 상태 코드와 산책 통계를 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs/1/statistics/recent?period=month')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                const mockJournals = await dataSource.getRepository(Journals).find();

                expect(response.body).toEqual({
                    totalWalkCnt: mockJournals.length,
                    totalDistance: mockJournals.reduce((acc, journal) => acc + journal.distance, 0),
                    totalTime: mockJournals.reduce((acc, journal) => acc + journal.duration, 0),
                });
            });
        });

        context('사용자가 소유하지 않은 강아지의 최근 한달 간 산책 통계 조회 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/3/statistics/recent?period=month')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        context('period query 없이 강아지의 최근 한달 간 산책 통계 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/1/statistics/recent')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('유효하지 않은 period query로 강아지의 최근 한달 간 산책 통계 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/1/statistics/recent?period=year')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });

            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/1/statistics/recent?period=week')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        testUnauthorizedAccess('강아지의 최근 한달 간 산책 통계 조회', 'get', '/dogs/1/statistics/recent?period=month');
    });

    describe('/dogs/:id/statistics (GET)', () => {
        context('사용자가 소유한 강아지의 한달 산책 횟수 조회 요청을 보내면', () => {
            it('200 상태 코드와 한달 산책 횟수를 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs/1/statistics?date=2024-05-08&period=month')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual({
                    '2024-05-01': 0,
                    '2024-05-02': 0,
                    '2024-05-03': 0,
                    '2024-05-04': 0,
                    '2024-05-05': 1,
                    '2024-05-06': 0,
                    '2024-05-07': 1,
                    '2024-05-08': 0,
                    '2024-05-09': 0,
                    '2024-05-10': 2,
                    '2024-05-11': 0,
                    '2024-05-12': 0,
                    '2024-05-13': 0,
                    '2024-05-14': 0,
                    '2024-05-15': 0,
                    '2024-05-16': 0,
                    '2024-05-17': 0,
                    '2024-05-18': 0,
                    '2024-05-19': 0,
                    '2024-05-20': 0,
                    '2024-05-21': 0,
                    '2024-05-22': 0,
                    '2024-05-23': 0,
                    '2024-05-24': 0,
                    '2024-05-25': 0,
                    '2024-05-26': 0,
                    '2024-05-27': 0,
                    '2024-05-28': 0,
                    '2024-05-29': 0,
                    '2024-05-30': 0,
                    '2024-05-31': 0,
                });
            });
        });

        context('사용자가 소유한 강아지의 일주일 산책 횟수 조회 요청을 보내면', () => {
            it('200 상태 코드와 일주일 산책 횟수를 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs/1/statistics?date=2024-05-08&period=week')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual({
                    '2024-05-05': 1,
                    '2024-05-06': 0,
                    '2024-05-07': 1,
                    '2024-05-08': 0,
                    '2024-05-09': 0,
                    '2024-05-10': 2,
                    '2024-05-11': 0,
                });
            });
        });

        context('사용자가 소유하지 않은 강아지의 한달 산책 횟수 조회 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/3/statistics?date=2024-05-08&period=month')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        context('사용자가 소유하지 않은 강아지의 일주일 산책 횟수 조회 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/3/statistics?date=2024-05-08&period=week')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        context('date query 없이 강아지의 산책 횟수 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/1/statistics?period=month')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('YYYY-MM-DD 형식이 아닌 date query로 강아지의 산책 횟수 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/1/statistics?date=20240508&period=month')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('period query 없이 강아지의 산책 횟수 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/1/statistics?date=2024-05-08')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('유효하지 않은 period query로 강아지의 산책 횟수 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/1/statistics?date=2024-05-08&period=year')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        testUnauthorizedAccess('강아지의 산책 횟수 조회', 'get', '/dogs/1/statistics?date=2024-05-08&period=month');
    });

    describe('/dogs/statistics (GET)', () => {
        context('사용자가 소유한 강아지들의 일주일 산책 현황 조회 요청을 보내면', () => {
            it('200 상태 코드와 일주일 산책 현황을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs/statistics')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual([
                    {
                        id: 1,
                        name: '덕지',
                        profilePhotoUrl: 'mock_profile_photo.jpg',
                        recommendedWalkAmount: 1800,
                        todayWalkAmount: 0,
                        weeklyWalks: [0, 0, 0, 0, 0, 0, 0],
                    },
                    {
                        id: 2,
                        name: '루이',
                        profilePhotoUrl: 'mock_profile_photo2.jpg',
                        recommendedWalkAmount: 7200,
                        todayWalkAmount: 0,
                        weeklyWalks: [0, 0, 0, 0, 0, 0, 0],
                    },
                ]);
            });
        });

        testUnauthorizedAccess('강아지들의 일주일 산책 현황 조회', 'get', '/dogs/statistics');
    });
});
