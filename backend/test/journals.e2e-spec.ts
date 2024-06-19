import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { VALID_ACCESS_TOKEN_100_YEARS } from './constants';

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

import { DogWalkDay } from '../src/dog-walk-day/dog-walk-day.entity';
import { Excrements } from '../src/excrements/excrements.entity';
import { createMockJournal } from '../src/fixtures/journals.fixture';
import { JournalPhotos } from '../src/journal-photos/journal-photos.entity';
import { Journals } from '../src/journals/journals.entity';
import { JournalsDogs } from '../src/journals-dogs/journals-dogs.entity';

describe('JournalsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        ({ app, dataSource } = await setupTestApp());
        await insertMockUsers();
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

            const expectJournals = [
                {
                    journalId: 8,
                    calories: 1200,
                    startedAt: expect.any(String),
                    duration: 135,
                    distance: 5500,
                    journalCnt: 8,
                },
                {
                    journalId: 9,
                    calories: 1300,
                    startedAt: expect.any(String),
                    duration: 150,
                    distance: 6000,
                    journalCnt: 9,
                },
            ];

            it('200 상태 코드와 산책 일지 목록을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/journals?dogId=1&date=2024-05-10')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                console.log(response.body);
                expect(response.body).toEqual(expectJournals);
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

                expect(await dataSource.getRepository(Journals).count()).toBe(1);
                expect(await dataSource.getRepository(JournalsDogs).count()).toBe(2);
                expect(await dataSource.getRepository(JournalPhotos).count()).toBe(2);
                expect(await dataSource.getRepository(Excrements).count({ where: { dogId: 1 } })).toBe(2);
                expect(await dataSource.getRepository(Excrements).count({ where: { dogId: 2 } })).toBe(1);

                const today = new Date();
                const dayOfWeek = today.getDay();
                const days = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
                const todayString = days[dayOfWeek];

                const dog1WalkDay = await dataSource
                    .getRepository(DogWalkDay)
                    .findOne({ where: { id: 1 }, select: days });
                if (!dog1WalkDay) throw new Error('dog1WalkDay not found');

                const dog2WalkDay = await dataSource
                    .getRepository(DogWalkDay)
                    .findOne({ where: { id: 2 }, select: days });
                if (!dog2WalkDay) throw new Error('dog2WalkDay not found');

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
                await insertMockJournalWithPhotosAndExcrements();
            });

            afterEach(async () => {
                await clearJournal();
                await clearDogs();
            });

            const expectDetail = {
                journalInfo: {
                    id: 1,
                    routes: [
                        {
                            lat: 87.4,
                            lng: 85.222,
                        },
                        {
                            lat: 75.23,
                            lng: 104.4839,
                        },
                    ],
                    memo: 'Enjoyed the walk with Buddy!',
                    photoUrls: ['1/photo1.jpeg', '1/photo2.png'],
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
                excrements: [
                    {
                        dogId: 1,
                        fecesCnt: 1,
                        urineCnt: 1,
                    },
                    {
                        dogId: 2,
                        fecesCnt: 1,
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
                await insertMockJournalWithPhotosAndExcrements();
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
                await insertMockJournalWithPhotosAndExcrements();
                const fakeDate = new Date('2024-06-12T00:00:00Z');
                setFakeDate(fakeDate);
            });

            afterEach(async () => {
                clearFakeDate();
                await clearJournal();
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
                if (!dog1WalkDay) throw new Error('dog1WalkDay not found');

                const dog2WalkDay = await dataSource
                    .getRepository(DogWalkDay)
                    .findOne({ where: { id: 2 }, select: days });
                if (!dog2WalkDay) throw new Error('dog2WalkDay not found');

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
                    .delete('/journals/3')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('산책 일지 삭제', 'delete', '/journals/1');
    });
});
