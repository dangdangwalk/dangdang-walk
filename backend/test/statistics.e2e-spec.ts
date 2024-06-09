import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { journalsEntries } from '../src/fixtures/statistics.fixture';
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
} from './test-utils';

const context = describe;

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
    });
});
