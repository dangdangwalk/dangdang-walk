import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { mockDog2Profile, mockDogProfile } from '../src/fixtures/dogs.fixture';
import { VALID_ACCESS_TOKEN_100_YEARS } from './constants';
import { clearDogs, clearUsers, closeTestApp, insertMockDogs, insertMockUser, setupTestApp } from './test-utils';

const context = describe;

describe('DogsController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        ({ app } = await setupTestApp());
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
    });
});
