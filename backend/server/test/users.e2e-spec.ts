import * as request from 'supertest';

import {
    OAUTH_ACCESS_TOKEN,
    OAUTH_REFRESH_TOKEN,
    VALID_ACCESS_TOKEN_100_YEARS,
    VALID_PROVIDER_KAKAO,
    VALID_REFRESH_TOKEN_100_YEARS,
} from './constants';

import { clearUsers, closeTestApp, insertMockUsers, setupTestApp, testUnauthorizedAccess } from './test-utils';

import { INestApplication } from '../node_modules/@nestjs/common';
import { DataSource } from '../node_modules/typeorm';

import { ROLE } from '../src/users/types/role.type';
import { Users } from '../src/users/users.entity';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        ({ app, dataSource } = await setupTestApp());
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
    });

    afterEach(async () => {
        await clearUsers();
    });

    afterAll(async () => {
        await closeTestApp();
    });

    describe('/users/me (GET)', () => {
        context('사용자가 회원 정보 조회 요청을 보내면', () => {
            const mockUserInfo = {
                nickname: 'mock_oauth_nickname#12345',
                email: 'mock_email@example.com',
                profileImageUrl: 'mock_profile_image.jpg',
                provider: VALID_PROVIDER_KAKAO,
            };

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
            const mockUserInfo = {
                nickname: 'mock_oauth_nickname#12345',
                email: 'mock_email@example.com',
                profileImageUrl: 'mock_profile_image.jpg',
            };
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
                if (!updatedUser) throw new Error('id가 1인 유저를 찾을 수 없습니다');
                updatedUser.nickname = updatedUser.nickname.split('#')[0];
                expect(updatedUser).toMatchObject({ ...mockUserInfo, ...updateMockUser });
            });
        });

        testUnauthorizedAccess('회원 정보 수정', 'patch', '/users/me');
    });
});
