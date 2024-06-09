import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { VALID_ACCESS_TOKEN_100_YEARS } from './constants';

import {
    clearDogs,
    clearFakeDate,
    clearJournals,
    clearUsers,
    closeTestApp,
    insertMockDogs,
    insertMockJournals,
    insertMockUser,
    setFakeDate,
    setupTestApp,
    testUnauthorizedAccess,
} from './test-utils';

import { mockDog, mockDog2 } from '../src/fixtures/dogs.fixture';
import { journalsEntries } from '../src/fixtures/statistics.fixture';

describe('StatisticsController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        ({ app } = await setupTestApp());
    });

    beforeEach(async () => {
        await insertMockUser();
        await insertMockDogs();
        await insertMockJournals();
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

                expect(response.body).toEqual({
                    totalWalkCnt: journalsEntries.length,
                    totalDistance: journalsEntries.reduce((acc, journal) => acc + journal.distance, 0),
                    totalTime: journalsEntries.reduce((acc, journal) => acc + journal.duration, 0),
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
                    '2024-05-01': 1,
                    '2024-05-02': 1,
                    '2024-05-03': 1,
                    '2024-05-04': 1,
                    '2024-05-05': 1,
                    '2024-05-06': 0,
                    '2024-05-07': 1,
                    '2024-05-08': 1,
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
                    '2024-05-31': 1,
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
                    '2024-05-08': 1,
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
                        id: mockDog.id,
                        name: mockDog.name,
                        profilePhotoUrl: mockDog.profilePhotoUrl,
                        recommendedWalkAmount: 1800,
                        todayWalkAmount: 0,
                        weeklyWalks: [0, 0, 0, 0, 0, 0, 0],
                    },
                    {
                        id: mockDog2.id,
                        name: mockDog2.name,
                        profilePhotoUrl: mockDog2.profilePhotoUrl,
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
