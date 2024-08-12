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

import { DataSource } from '../node_modules/typeorm';
DataSource;

import { DogWalkDay } from '../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../src/dogs/dogs.entity';
import { GENDER } from '../src/dogs/types/dogs.type';
import { TodayWalkTime } from '../src/today-walk-time/today-walk-time.entity';
import { ROLE } from '../src/users/types/role.type';
import { Users } from '../src/users/users.entity';

describe('DogsController (e2e)', () => {
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

    describe('/dogs (GET)', () => {
        context('사용자가 소유한 강아지가 없을 때 소유한 강아지 목록 요청을 보내면', () => {
            it('200 상태 코드와 빈 배열을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual([]);
            });
        });

        context('사용자가 소유한 강아지가 존재할 때 소유한 강아지 목록 요청을 보내면', () => {
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

            it('200 상태 코드와 강아지 프로필 목록을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual([
                    {
                        id: 1,
                        name: '덕지',
                        breed: '아펜핀셔',
                        gender: 'MALE',
                        isNeutered: true,
                        birth: null,
                        weight: 2,
                        profilePhotoUrl: 'mock_profile_photo.jpg',
                    },
                    {
                        id: 2,
                        name: '루이',
                        breed: '아프간 하운드',
                        gender: 'FEMALE',
                        isNeutered: false,
                        birth: null,
                        weight: 1,
                        profilePhotoUrl: 'mock_profile_photo2.jpg',
                    },
                ]);
            });
        });

        testUnauthorizedAccess('강아지 목록', 'get', '/dogs');
    });

    describe('/dogs (POST)', () => {
        context('사용자가 강아지 등록 요청을 보내면', () => {
            afterEach(async () => {
                await clearDogs();
            });

            const createDogMock = {
                name: '덕지',
                breed: '아펜핀셔',
                gender: 'MALE',
                isNeutered: true,
                birth: null,
                weight: 2,
                profilePhotoUrl: 'mock_profile_photo.jpg',
            };

            it('201 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .post('/dogs')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(createDogMock)
                    .expect(201);

                expect(await dataSource.getRepository(Dogs).count()).toBe(1);
            });
        });

        context('사용자가 존재하지 않는 견종으로 강아지 등록 요청을 보내면', () => {
            const invalidBreedMock = {
                name: '덕지',
                breed: '시고르자브종',
                gender: 'MALE',
                isNeutered: true,
                birth: null,
                weight: 2,
                profilePhotoUrl: 'mock_profile_photo.jpg',
            };

            it('404 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/dogs')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(invalidBreedMock)
                    .expect(404);
            });
        });

        testUnauthorizedAccess('강아지 등록', 'post', '/dogs');
    });

    describe('/dogs/:id (GET)', () => {
        context('사용자가 자신이 소유한 강아지의 프로필 조회 요청을 보내면', () => {
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

            it('200 상태 코드와 강아지 프로필을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual({
                    id: 1,
                    name: '덕지',
                    breed: '아펜핀셔',
                    gender: 'MALE',
                    isNeutered: true,
                    birth: null,
                    weight: 2,
                    profilePhotoUrl: 'mock_profile_photo.jpg',
                });
            });
        });

        context('사용자가 자신이 소유하지 않은 강아지의 프로필 조회 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('강아지 프로필 조회', 'get', '/dogs/1');
    });

    describe('/dogs/:id (PATCH)', () => {
        context('사용자가 자신이 소유한 강아지의 정보 수정 요청을 보내면', () => {
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

            const updateData = {
                name: '루이',
                breed: '아프간 하운드',
                gender: 'FEMALE',
                isNeutered: false,
                birth: null,
                weight: 1,
                profilePhotoUrl: 'mock_profile_photo2.jpg',
            };

            it('204 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .patch('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(updateData)
                    .expect(204);

                const updatedDog = await dataSource.getRepository(Dogs).findOne({ where: { id: 1 } });
                if (!updatedDog) throw new Error('id가 1인 강아지를 찾을 수 없습니다');
                updatedDog.breed = (updatedDog.breed as any).koreanName;

                expect(updatedDog).toEqual({
                    id: 1,
                    walkDayId: 1,
                    todayWalkTimeId: 1,
                    name: '루이',
                    breed: '아프간 하운드',
                    gender: 'FEMALE',
                    isNeutered: false,
                    birth: null,
                    weight: 1,
                    profilePhotoUrl: 'mock_profile_photo2.jpg',
                    breedId: 2,
                    isWalking: false,
                    updatedAt: expect.any(Date),
                });
            });
        });

        context('사용자가 자신이 소유하지 않은 강아지의 정보 수정 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .patch('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        context('사용자가 존재하지 않는 견종으로 강아지의 정보 수정 요청을 보내면', () => {
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

            const invalidDogMock = {
                name: '루이',
                breed: '시고르자브종',
                gender: 'FEMALE',
                isNeutered: false,
                birth: null,
                weight: 1,
                profilePhotoUrl: 'mock_profile_photo2.jpg',
            };

            it('404 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .patch('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(invalidDogMock)
                    .expect(404);
            });
        });

        testUnauthorizedAccess('강아지 정보 수정', 'patch', '/dogs/1');
    });

    describe('/dogs/:id (DELETE)', () => {
        context('사용자가 자신이 소유한 강아지의 삭제 요청을 보내면', () => {
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

            it('204 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .delete('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(204);

                expect(await dataSource.getRepository(Dogs).count()).toBe(0);
            });
        });

        context('사용자가 자신이 소유하지 않은 강아지의 삭제 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .delete('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('강아지 삭제', 'delete', '/dogs/1');
    });
});
