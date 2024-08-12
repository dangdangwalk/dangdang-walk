import * as request from 'supertest';

import {
    AUTHORIZE_CODE,
    EXPIRED_REFRESH_TOKEN,
    INVALID_PROVIDER,
    MALFORMED_REFRESH_TOKEN,
    OAUTH_ACCESS_TOKEN,
    OAUTH_REFRESH_TOKEN,
    VALID_ACCESS_TOKEN_100_YEARS,
    VALID_PROVIDER_KAKAO,
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
import { DataSource } from '../node_modules/typeorm';

import { DogWalkDay } from '../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../src/dogs/dogs.entity';
import { GENDER } from '../src/dogs/types/dogs.type';
import { TodayWalkTime } from '../src/today-walk-time/today-walk-time.entity';
import { ROLE } from '../src/users/types/role.type';
import { Users } from '../src/users/users.entity';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        ({ app, dataSource } = await setupTestApp());
    });

    afterAll(async () => {
        await clearUsers();
        await closeTestApp();
    });

    describe('/auth/login (POST)', () => {
        context('비회원이 로그인 요청을 보내면', () => {
            it('404 상태 코드와 Oauth data cookie를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        authorizeCode: AUTHORIZE_CODE,
                        provider: VALID_PROVIDER_KAKAO,
                    })
                    .expect(404)
                    .expect('set-cookie', /oauthRefreshToken=.+/)
                    .expect('set-cookie', /oauthAccessToken=.+/)
                    .expect('set-cookie', /provider=kakao;/);
            });
        });

        context('회원이 로그인 요청을 보내면', () => {
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
            });

            afterEach(async () => {
                await clearUsers();
            });

            it('200 상태 코드와 body에는 access token, cookie에는 refresh token을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        authorizeCode: AUTHORIZE_CODE,
                        provider: VALID_PROVIDER_KAKAO,
                    })
                    .expect(200)
                    .expect('set-cookie', /refreshToken=.+;/);

                expect(response.body).toEqual({ accessToken: expect.any(String) });
            });
        });

        context('요청 body에 authorizeCode field가 빠진 경우', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        provider: VALID_PROVIDER_KAKAO,
                    })
                    .expect(400);
            });
        });

        context('요청 body에 provider field가 빠진 경우', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        authorizeCode: AUTHORIZE_CODE,
                    })
                    .expect(400);
            });
        });

        context('요청 body의 provider field 값이 google, kakao, naver 중 하나가 아닌 경우', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        authorizeCode: AUTHORIZE_CODE,
                        provider: INVALID_PROVIDER,
                    })
                    .expect(400);
            });
        });
    });

    describe('/auth/signup (POST)', () => {
        context('비회원이 회원가입 요청을 보내면', () => {
            afterEach(async () => {
                await clearUsers();
            });

            it('201 상태 코드와 body에는 access token, cookie에는 refresh token을 반환하고 Oauth data cookie를 삭제해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .post('/auth/signup')
                    .set('Cookie', [
                        `oauthRefreshToken=${OAUTH_REFRESH_TOKEN}`,
                        `oauthAccessToken=${OAUTH_ACCESS_TOKEN}`,
                        `provider=${VALID_PROVIDER_KAKAO}`,
                    ])
                    .expect(201)
                    .expect('set-cookie', /refreshToken=.+;/)
                    .expect('set-cookie', /oauthRefreshToken=;/)
                    .expect('set-cookie', /oauthAccessToken=;/)
                    .expect('set-cookie', /provider=;/);

                expect(response.body).toEqual({ accessToken: expect.any(String) });

                expect(await dataSource.getRepository(Users).findOne({ where: { id: 1 } })).toEqual({
                    id: 1,
                    nickname: expect.any(String),
                    email: 'mock_email@example.com',
                    profileImageUrl: 'default/profile.png',
                    role: ROLE.User,
                    mainDogId: null,
                    oauthId: '12345',
                    oauthAccessToken: OAUTH_ACCESS_TOKEN,
                    oauthRefreshToken: OAUTH_REFRESH_TOKEN,
                    refreshToken: expect.any(String),
                    createdAt: expect.any(Date),
                });
            });
        });

        context('회원이 회원가입 요청을 보내면', () => {
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
            });

            afterEach(async () => {
                await clearUsers();
            });

            it('409 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/signup')
                    .set('Cookie', [
                        `oauthRefreshToken=${OAUTH_REFRESH_TOKEN}`,
                        `oauthAccessToken=${OAUTH_ACCESS_TOKEN}`,
                        `provider=${VALID_PROVIDER_KAKAO}`,
                    ])
                    .expect(409);
            });
        });

        context('요청 cookie에 oauthRefreshToken field가 빠진 경우', () => {
            it('401 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/signup')
                    .set('Cookie', [`oauthAccessToken=${OAUTH_ACCESS_TOKEN}`, `provider=${VALID_PROVIDER_KAKAO}`])
                    .expect(401);
            });
        });

        context('요청 cookie에 oauthAccessToken field가 없는 경우', () => {
            it('401 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/signup')
                    .set('Cookie', [`oauthRefreshToken=${OAUTH_REFRESH_TOKEN}`, `provider=${VALID_PROVIDER_KAKAO}`])
                    .expect(401);
            });
        });

        context('요청 cookie에 provider field가 없는 경우', () => {
            it('401 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/signup')
                    .set('Cookie', [
                        `oauthRefreshToken=${OAUTH_REFRESH_TOKEN}`,
                        `oauthAccessToken=${OAUTH_ACCESS_TOKEN}`,
                    ])
                    .expect(401);
            });
        });

        context('요청 cookie의 provider field 값이 google, kakao, naver 중 하나가 아닌 경우', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/signup')
                    .set('Cookie', [
                        `oauthRefreshToken=${OAUTH_REFRESH_TOKEN}`,
                        `oauthAccessToken=${OAUTH_ACCESS_TOKEN}`,
                        `provider=${INVALID_PROVIDER}`,
                    ])
                    .expect(400);
            });
        });
    });

    describe('/auth/logout (POST)', () => {
        context('회원이 유효한 access token을 Authorization header에 담아 로그아웃 요청을 보내면', () => {
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
            });

            afterEach(async () => {
                await clearUsers();
            });

            it('200 상태 코드를 반환하고 refresh token cookie를 삭제해야 한다.', async () => {
                return request(app.getHttpServer())
                    .post('/auth/logout')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200)
                    .expect('set-cookie', /refreshToken=;/);
            });
        });

        testUnauthorizedAccess('로그아웃', 'post', '/auth/logout');
    });

    describe('/auth/token (GET)', () => {
        context('회원이 유효한 refresh token을 cookie에 가지고 token 재발급 요청을 보내면', () => {
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
            });

            afterEach(async () => {
                await clearUsers();
            });

            it('200 상태 코드와 body에는 access token, cookie에는 refresh token을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/auth/token')
                    .set('Cookie', [`refreshToken=${VALID_REFRESH_TOKEN_100_YEARS}`])
                    .expect(200)
                    .expect('set-cookie', /refreshToken=.+;/);

                expect(response.body).toEqual({ accessToken: expect.any(String) });
            });
        });

        context('요청 cookie에 refreshToken field가 없는 경우', () => {
            it('401 상태 코드를 반환해야 한다.', async () => {
                return request(app.getHttpServer()).get('/auth/token').expect(401);
            });
        });

        context('구조가 잘못된 refresh token을 cookie에 담아 token 재발급 요청을 보내면', () => {
            it('401 상태 코드를 반환해야 한다.', async () => {
                return request(app.getHttpServer())
                    .get('/auth/token')
                    .set('Cookie', [`refreshToken=${MALFORMED_REFRESH_TOKEN}`])
                    .expect(401);
            });
        });

        context('만료된 refresh token을 cookie에 담아 token 재발급 요청을 보내면', () => {
            it('401 상태 코드를 반환해야 한다.', async () => {
                return request(app.getHttpServer())
                    .get('/auth/token')
                    .set('Cookie', [`refreshToken=${EXPIRED_REFRESH_TOKEN}`])
                    .expect(401);
            });
        });

        context('존재하지 않는 oauthId를 가진 refresh token을 cookie에 담아 token 재발급 요청을 보내면', () => {
            it('401 상태 코드를 반환해야 한다.', async () => {
                return request(app.getHttpServer())
                    .get('/auth/token')
                    .set('Cookie', [`refreshToken=${VALID_REFRESH_TOKEN_100_YEARS}`])
                    .expect(401);
            });
        });
    });

    describe('/auth/deactivate (DELETE)', () => {
        context('회원이 유효한 access token을 Authorization header에 담아 회원탈퇴 요청을 보내면', () => {
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
                            profilePhotoUrl: '1/mock_profile_photo.jpg',
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
                            profilePhotoUrl: 'default/profile.png',
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

            it('200 상태 코드를 반환하고 refresh token cookie를 삭제해야 한다.', async () => {
                await request(app.getHttpServer())
                    .delete('/auth/deactivate')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200)
                    .expect('set-cookie', /refreshToken=;/);

                expect(await dataSource.getRepository(Users).findOne({ where: { id: 1 } })).toBe(null);
                expect(await dataSource.getRepository(Dogs).count()).toBe(0);
            });
        });

        testUnauthorizedAccess('회원탈퇴', 'delete', '/auth/deactivate');
    });
});
