import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { mockUserProfile } from '../src/fixtures/users.fixture';
import { Users } from '../src/users/users.entity';

import { VALID_ACCESS_TOKEN_100_YEARS } from './constants';
import { clearUsers, closeTestApp, insertMockUser, setupTestApp, testUnauthorizedAccess } from './test-utils';

const context = describe;

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        ({ app, dataSource } = await setupTestApp());
    });

    beforeEach(async () => {
        await insertMockUser();
    });

    afterEach(async () => {
        await clearUsers();
    });

    afterAll(async () => {
        await closeTestApp();
    });

    describe('/users/me (GET)', () => {
        context('사용자가 회원 정보 조회 요청을 보내면', () => {
            const { id, ...mockUserInfo } = mockUserProfile;

            it('200 상태 코드와 사용자 정보를 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .get('/users/me')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .expect(200);

                expect(response.body).toEqual(mockUserInfo);
            });
        });

        testUnauthorizedAccess('회원 정보 조회', 'get', '/users/me');
    });

    describe('/users/me (PATCH)', () => {
        context('사용자가 회원 정보 수정 요청을 보내면', () => {
            const { id, provider, ...mockUserInfo } = mockUserProfile;
            const updateMockUser = {
                nickname: 'new_mock_nickname',
                profileImageUrl: 'new_mock_profile_image.jpg',
            };

            it('204 상태 코드를 반환해야 한다.', async () => {
                await request(app.getHttpServer())
                    .patch('/users/me')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(updateMockUser)
                    .expect(204);

                const updatedUser = await dataSource.getRepository(Users).findOne({ where: { id: 1 } });
                if (!updatedUser) throw new Error('User not found');
                updatedUser.nickname = updatedUser.nickname.split('#')[0];
                expect(updatedUser).toMatchObject({ ...mockUserInfo, ...updateMockUser });
            });
        });

        testUnauthorizedAccess('회원 정보 수정', 'patch', '/users/me');
    });
});
