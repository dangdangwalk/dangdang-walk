import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { VALID_ACCESS_TOKEN_100_YEARS } from './constants';
import { clearUsers, closeTestApp, insertMockUser, setupTestApp, testUnauthorizedAccess } from './test-utils';

const context = describe;

describe('S3Controller (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        ({ app } = await setupTestApp());
        await insertMockUser();
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
