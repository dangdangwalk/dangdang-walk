import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { VALID_ACCESS_TOKEN_100_YEARS } from './constants';

import {
    clearDogs,
    clearJournal,
    clearJournals,
    clearUsers,
    closeTestApp,
    insertMockDogs,
    insertMockJournal,
    insertMockJournals,
    insertMockUser,
    setupTestApp,
    testUnauthorizedAccess,
} from './test-utils';

import { Excrements } from '../src/excrements/excrements.entity';
import { createMockJournal, mockJournalProfile } from '../src/fixtures/journals.fixture';
import { mockJournals } from '../src/fixtures/statistics.fixture';
import { JournalPhotos } from '../src/journal-photos/journal-photos.entity';
import { Journals } from '../src/journals/journals.entity';
import { JournalsDogs } from '../src/journals-dogs/journals-dogs.entity';

describe('JournalsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        ({ app, dataSource } = await setupTestApp());
        await insertMockUser();
    });

    afterAll(async () => {
        await clearUsers();
        await closeTestApp();
    });

    describe('/journals (GET)', () => {
        context('사용자가 산책을 하지 않은 날의 산책 일지 목록 조회 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
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
                await insertMockDogs();
                await insertMockJournals();
            });

            afterEach(async () => {
                await clearJournals();
                await clearDogs();
            });

            const [, , , , , , , journal8, journal9] = mockJournals;

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

        context('사용자가 소유하지 않은 강아지로 산책 일지 목록 조회 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals?dogId=3&date=2024-06-11')
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
                await insertMockDogs();
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
                await insertMockDogs();
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
                await insertMockDogs();
            });

            afterEach(async () => {
                await clearJournal();
                await clearDogs();
            });

            it('201 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .post('/journals')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(createMockJournal)
                    .expect(201);

                expect(await dataSource.getRepository(Journals).count({})).toBe(1);
                expect(await dataSource.getRepository(JournalsDogs).count()).toBe(2);
                expect(await dataSource.getRepository(JournalPhotos).count()).toBe(2);
                expect(await dataSource.getRepository(Excrements).count({ where: { dogId: 1 } })).toBe(2);
                expect(await dataSource.getRepository(Excrements).count({ where: { dogId: 2 } })).toBe(1);
            });
        });

        context('사용자가 소유하지 않은 강아지가 포함된 산책 일지 생성 요청을 보내면', () => {
            afterEach(async () => {
                await clearDogs();
            });

            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/journals')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(createMockJournal)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('산책 일지 생성', 'post', '/journals');
    });

    describe('/journals/:id (GET)', () => {
        context('사용자가 자신이 소유한 산책 일지의 상세 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
                await insertMockJournal();
            });

            afterEach(async () => {
                await clearJournal();
                await clearDogs();
            });

            it('200 상태 코드와 산책 일지 상세 정보를 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/journals/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual(mockJournalProfile);
            });
        });

        context('사용자가 자신이 소유하지 않은 산책 일지의 상세 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
            });

            afterEach(async () => {
                await clearDogs();
            });

            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/journals/3')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('산책 일지 상세', 'get', '/journals/1');
    });

    describe('/journals/:id (PATCH)', () => {
        context('사용자가 자신이 소유한 산책 일지의 정보 수정 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
                await insertMockJournal();
            });

            afterEach(async () => {
                await clearJournal();
                await clearDogs();
            });

            const updateMockJournal = {
                memo: '메모 수정',
                photoUrls: ['1/test1.png', '1/test2.jpeg'],
            };

            it('204 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .patch('/journals/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(updateMockJournal)
                    .expect(204);

                const updatedJournal = await dataSource.getRepository(Journals).findOne({ where: { id: 1 } });
                if (!updatedJournal) throw new Error('Journal not found');
                const updatedJournalPhotos = await dataSource
                    .getRepository(JournalPhotos)
                    .find({ where: { journalId: 1 } });
                if (!updatedJournalPhotos) throw new Error('Journal Photo not found');
                expect(updatedJournal.memo).toBe(updateMockJournal.memo);
                expect(updatedJournalPhotos).toHaveLength(updateMockJournal.photoUrls.length);
                expect(updatedJournalPhotos.map((journalPhoto) => journalPhoto.photoUrl)).toMatchObject(
                    updateMockJournal.photoUrls,
                );
            });
        });

        context('사용자가 자신이 소유하지 않은 산책 일지의 정보 수정 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .patch('/journals/3')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('산책 일지 정보 수정', 'patch', '/journals/1');
    });

    describe('/journals/:id (DELETE)', () => {
        context('사용자가 자신이 소유한 산책 일지의 삭제 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
                await insertMockJournal();
            });

            afterEach(async () => {
                await clearJournal();
                await clearDogs();
            });

            it('204 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .delete('/journals/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(204);

                expect(await dataSource.getRepository(Journals).count()).toBe(0);
            });
        });

        context('사용자가 자신이 소유하지 않은 산책 일지의 삭제 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .delete('/journals/3')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('산책 일지 삭제', 'delete', '/journals/1');
    });
});
