import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { VALID_ACCESS_TOKEN_100_YEARS } from './constants';
import {
    clearDogs,
    clearUsers,
    closeTestApp,
    insertMockDogs,
    insertMockUsers,
    setupTestApp,
    testUnauthorizedAccess,
} from './test-utils';

import { mockDog2Profile, mockDogProfile } from '../src/fixtures/dogs.fixture';

describe('WalkController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        ({ app } = await setupTestApp());
    });

    beforeEach(async () => {
        await insertMockUsers();
        await insertMockDogs();
    });

    afterEach(async () => {
        await clearDogs();
        await clearUsers();
    });

    afterAll(async () => {
        await closeTestApp();
    });

    describe('/dogs/walks/start (POST)', () => {
        context('사용자가 소유한 강아지 목록으로 산책 시작 요청을 보내면', () => {
            it('200 상태 코드와 강아지 목록을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .post('/dogs/walks/start')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send([1, 2])
                    .expect(200);

                expect(response.body).toEqual([1, 2]);
            });
        });

        context('사용자가 소유하지 않은 강아지가 포함된 목록으로 산책 시작 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/dogs/walks/start')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send([1, 2, 3])
                    .expect(403);
            });
        });

        context('사용자가 유효하지 않은 body로 산책 시작 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/dogs/walks/start')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(['1', 2])
                    .expect(400);
            });
        });

        testUnauthorizedAccess('산책 시작', 'post', '/dogs/walks/start');
    });

    describe('/dogs/walks/stop (POST)', () => {
        context('사용자가 소유한 강아지 목록으로 산책 종료 요청을 보내면', () => {
            it('200 상태 코드와 강아지 목록을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .post('/dogs/walks/stop')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send([1, 2])
                    .expect(200);

                expect(response.body).toEqual([1, 2]);
            });
        });

        context('사용자가 소유하지 않은 강아지가 포함된 목록으로 산책 종료 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/dogs/walks/stop')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send([1, 2, 3])
                    .expect(403);
            });
        });

        context('사용자가 유효하지 않은 body로 산책 종료 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/dogs/walks/stop')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(['1', 2])
                    .expect(400);
            });
        });

        testUnauthorizedAccess('산책 종료', 'post', '/dogs/walks/stop');
    });

    describe('/dogs/walks/available (POST)', () => {
        context('사용자가 산책 가능한 강아지 목록 조회 요청을 보내면', () => {
            it('200 상태 코드와 강아지 목록을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs/walks/available')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send([1, 2])
                    .expect(200);

                expect(response.body).toEqual([
                    {
                        id: mockDogProfile.id,
                        name: mockDogProfile.name,
                        profilePhotoUrl: mockDogProfile.profilePhotoUrl,
                    },
                    {
                        id: mockDog2Profile.id,
                        name: mockDog2Profile.name,
                        profilePhotoUrl: mockDog2Profile.profilePhotoUrl,
                    },
                ]);
            });
        });

        testUnauthorizedAccess('산책 가능한 강아지 목록 조회', 'get', '/dogs/walks/available');
    });
});
