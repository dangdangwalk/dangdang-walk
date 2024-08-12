import * as request from 'supertest';

import {
    OAUTH_ACCESS_TOKEN,
    OAUTH_REFRESH_TOKEN,
    VALID_ACCESS_TOKEN_100_YEARS,
    VALID_REFRESH_TOKEN_100_YEARS,
} from './constants';

import {
    clearDogs,
    clearUsers,
    closeTestApp,
    insertMockDogs,
    insertMockUsers,
    setupTestApp,
    testUnauthorizedAccess,
} from './test-utils';

import { INestApplication } from '../node_modules/@nestjs/common';

import { DogWalkDay } from '../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../src/dogs/dogs.entity';
import { GENDER } from '../src/dogs/types/dogs.type';
import { TodayWalkTime } from '../src/today-walk-time/today-walk-time.entity';
import { ROLE } from '../src/users/types/role.type';
import { Users } from '../src/users/users.entity';

describe('WalkController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        ({ app } = await setupTestApp());
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
                        id: 1,
                        name: '덕지',
                        profilePhotoUrl: 'mock_profile_photo.jpg',
                    },
                    {
                        id: 2,
                        name: '루이',
                        profilePhotoUrl: 'mock_profile_photo2.jpg',
                    },
                ]);
            });
        });

        testUnauthorizedAccess('산책 가능한 강아지 목록 조회', 'get', '/dogs/walks/available');
    });
});
