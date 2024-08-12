import * as request from 'supertest';

import {
    OAUTH_ACCESS_TOKEN,
    OAUTH_REFRESH_TOKEN,
    VALID_ACCESS_TOKEN_100_YEARS,
    VALID_REFRESH_TOKEN_100_YEARS,
} from './constants';

import { clearUsers, closeTestApp, insertMockUsers, setupTestApp, testUnauthorizedAccess } from './test-utils';

import { INestApplication } from '../node_modules/@nestjs/common';

import { ROLE } from '../src/users/types/role.type';
import { Users } from '../src/users/users.entity';

const context = describe;

describe('S3Controller (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        ({ app } = await setupTestApp());
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

    describe('/images/presigned-url (POST)', () => {
        context('사용자가 이미지 업로드를 위한 presignedUrl 요청을 보내면', () => {
            it('200 상태 코드와 presignedUrl을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .post('/images/presigned-url')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(['jpeg', 'png'])
                    .expect(200);

                expect(response.body).toHaveLength(2);

                expect(response.body[0]).toHaveProperty('filename');
                expect(response.body[0]).toHaveProperty('url');
                expect(response.body[0].filename).toMatch(new RegExp(`^1/[a-f0-9-]+\.jpeg$`));
                expect(typeof response.body[0].url).toBe('string');

                expect(response.body[1]).toHaveProperty('filename');
                expect(response.body[1]).toHaveProperty('url');
                expect(response.body[1].filename).toMatch(new RegExp(`^1/[a-f0-9-]+\.png$`));
                expect(typeof response.body[1].url).toBe('string');
            });
        });

        context('사용자가 유효하지 않은 body로 presignedUrl 요청을 보내면', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/images/presigned-url')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(['jpeg', 'avi'])
                    .expect(400);
            });

            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/images/presigned-url')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send([1, 'gif'])
                    .expect(400);
            });

            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/images/presigned-url')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send('png')
                    .expect(400);
            });
        });

        testUnauthorizedAccess('이미지 업로드를 위한 presignedUrl', 'post', '/images/presigned-url');
    });

    describe('/images (DELETE)', () => {
        context('사용자가 자신이 소유한 이미지의 삭제 요청을 보내면', () => {
            it('204 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .delete('/images')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(['1/dangdangbucket-1.jpeg', '1/dangdangbucket-2.png'])
                    .expect(204);
            });
        });

        context('사용자가 자신이 소유하지 않은 이미지의 삭제 요청을 보내면', () => {
            it('403 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .delete('/images')
                    .set('Authorization', `Bearer ${VALID_ACCESS_TOKEN_100_YEARS}`)
                    .send(['1/dangdangbucket-1.jpeg', '2/dangdangbucket-2.png'])
                    .expect(403);
            });
        });

        testUnauthorizedAccess('이미지 삭제', 'delete', '/images');
    });
});
