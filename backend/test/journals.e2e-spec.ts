import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { VALID_ACCESS_TOKEN_100_YEARS } from './constants';

import {
    clearDogs,
    clearJournals,
    clearUsers,
    closeTestApp,
    insertMockDogs,
    insertMockJournals,
    insertMockUser,
    setupTestApp,
    testUnauthorizedAccess,
} from './test-utils';

import { journalsEntries } from '../src/fixtures/statistics.fixture';

describe('JournalsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

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

    describe('/journals (GET)', () => {
        context('사용자가 산책을 하지 않은 날의 산책일지 목록 조회 요청을 보내면', () => {
            it('200 상태 코드와 빈 배열을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/journals?dogId=1&date=2024-06-10')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual([]);
            });
        });

        context('사용자가 산책일지 목록 조회 요청을 보내면', () => {
            const [, , , , , , , journal8, journal9] = journalsEntries;

            it('200 상태 코드와 산책 일지 목록을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/journals?dogId=1&date=2024-05-10')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual([
                    {
                        journalId: 8,
                        startedAt: new Date(journal8.startedAt).toISOString(),
                        distance: journal8.distance,
                        calories: journal8.calories,
                        duration: journal8.duration,
                        journalCnt: 8,
                    },
                    {
                        journalId: 9,
                        startedAt: new Date(journal9.startedAt).toISOString(),
                        distance: journal9.distance,
                        calories: journal9.calories,
                        duration: journal9.duration,
                        journalCnt: 9,
                    },
                ]);
            });
        });

        context('사용자가 소유한 강아지가 아닐 때 산책일지 목록 조회 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?dogId=3&date=2024-06-11')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        context('dogId query 없이 산책일지 목록 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?date=2024-06-11')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('유효하지 않은 dogId query로 산책일지 목록 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?dogId=test&date=2024-06-11')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('date query 없이 산책일지 목록 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?dogId=1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        context('YYYY-MM-DD 형식이 아닌 date query로 산책일지 목록 조회 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?dogId=1&date=20240611')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(400);
            });
        });

        testUnauthorizedAccess('산책일지 목록 조회', 'get', '/journals');
    });
});
