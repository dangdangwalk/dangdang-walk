import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { VALID_ACCESS_TOKEN_100_YEARS } from './constants';

import {
    clearDogs,
    clearUsers,
    closeTestApp,
    insertMockDogs,
    insertMockUser,
    setupTestApp,
    testUnauthorizedAccess,
} from './test-utils';

import { Dogs } from '../src/dogs/dogs.entity';
import { mockDog2Profile, mockDogProfile } from '../src/fixtures/dogs.fixture';

describe('DogsController (e2e)', () => {
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
                await insertMockDogs();
            });

            afterEach(async () => {
                await clearDogs();
            });

            it('200 상태 코드와 강아지 프로필 목록을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual([mockDogProfile, mockDog2Profile]);
            });
        });

        testUnauthorizedAccess('강아지 목록', 'get', '/dogs');
    });

    describe('/dogs (POST)', () => {
        context('사용자가 강아지 등록 요청을 보내면', () => {
            afterEach(async () => {
                await clearDogs();
            });

            const { id, ...createMockDog } = mockDogProfile;

            it('201 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .post('/dogs')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(createMockDog)
                    .expect(201);

                expect(await dataSource.getRepository(Dogs).count()).toBe(1);
            });
        });

        context('사용자가 존재하지 않는 견종으로 강아지 등록 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
            });

            afterEach(async () => {
                await clearDogs();
            });

            const { id, ...createMockDog } = mockDogProfile;
            createMockDog.breed = '시고르자브종';

            it('404 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/dogs')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(createMockDog)
                    .expect(404);
            });
        });

        testUnauthorizedAccess('강아지 등록', 'post', '/dogs');
    });

    describe('/dogs/:id (GET)', () => {
        context('사용자가 자신이 소유한 강아지의 프로필 조회 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
            });

            afterEach(async () => {
                await clearDogs();
            });

            it('200 상태 코드와 강아지 프로필을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual(mockDogProfile);
            });
        });

        context('사용자가 자신이 소유하지 않은 강아지의 프로필 조회 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
            });

            afterEach(async () => {
                await clearDogs();
            });

            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .get('/dogs/3')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('강아지 프로필 조회', 'get', '/dogs/1');
    });

    describe('/dogs/:id (PATCH)', () => {
        context('사용자가 자신이 소유한 강아지의 정보 수정 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
            });

            afterEach(async () => {
                await clearDogs();
            });

            const { id, ...updateMockDog } = mockDog2Profile;

            it('204 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .patch('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(updateMockDog)
                    .expect(204);

                const updatedDog = await dataSource.getRepository(Dogs).findOne({ where: { id: 1 } });
                if (!updatedDog) throw new Error('Dog not found');
                updatedDog.breed = (updatedDog.breed as any).koreanName;
                expect(updatedDog).toMatchObject(updateMockDog);
            });
        });

        context('사용자가 자신이 소유하지 않은 강아지의 정보 수정 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .patch('/dogs/3')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        context('사용자가 존재하지 않는 견종으로 강아지의 정보 수정 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
            });

            afterEach(async () => {
                await clearDogs();
            });

            const { id, ...updateMockDog } = mockDog2Profile;
            updateMockDog.breed = '시고르자브종';

            it('404 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .patch('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(updateMockDog)
                    .expect(404);
            });
        });

        testUnauthorizedAccess('강아지 정보 수정', 'patch', '/dogs/1');
    });

    describe('/dogs/:id (DELETE)', () => {
        context('사용자가 자신이 소유한 강아지의 삭제 요청을 보내면', () => {
            beforeEach(async () => {
                await insertMockDogs();
            });

            afterEach(async () => {
                await clearDogs();
            });

            it('204 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .delete('/dogs/1')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(204);

                expect(await dataSource.getRepository(Dogs).count()).toBe(1);
            });
        });

        context('사용자가 자신이 소유하지 않은 강아지의 삭제 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .delete('/dogs/3')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(403);
            });
        });

        testUnauthorizedAccess('강아지 삭제', 'delete', '/dogs/1');
    });
});
