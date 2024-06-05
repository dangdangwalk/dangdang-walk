import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { mockUser } from '../src/fixtures/users.fixture';
import { Users } from '../src/users/users.entity';
import { TEST_PROVIDER, closeTestApp, setupTestApp } from './test-utils';

const context = describe;

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        ({ app, dataSource } = await setupTestApp());
    });

    afterAll(async () => {
        const userRepository = dataSource.getRepository(Users);
        await userRepository.query('SET FOREIGN_KEY_CHECKS = 0;');
        await userRepository.clear();
        await userRepository.query('SET FOREIGN_KEY_CHECKS = 1;');

        await closeTestApp();
    });

    describe('/auth/login (POST)', () => {
        context('비회원이 로그인 요청을 보내면', () => {
            it('404 상태 코드와 Oauth data cookie를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        authorizeCode: 'authorizeCode',
                        provider: TEST_PROVIDER,
                    })
                    .expect(404)
                    .expect('set-cookie', /oauthRefreshToken=.+/)
                    .expect('set-cookie', /oauthAccessToken=.+/)
                    .expect('set-cookie', /provider=kakao;/);
            });
        });

        context('회원이 로그인 요청을 보내면', () => {
            beforeEach(async () => {
                const userRepository = dataSource.getRepository(Users);
                await userRepository.save(mockUser);
            });

            afterEach(async () => {
                const userRepository = dataSource.getRepository(Users);
                await userRepository.query('SET FOREIGN_KEY_CHECKS = 0;');
                await userRepository.clear();
                await userRepository.query('SET FOREIGN_KEY_CHECKS = 1;');
            });

            it('200 상태 코드와 body에는 access token, cookie에는 refresh token을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        authorizeCode: 'authorizeCode',
                        provider: TEST_PROVIDER,
                    })
                    .expect(200)
                    .expect('set-cookie', /refreshToken=.+;/);

                expect(response.body).toHaveProperty('accessToken');
                expect(typeof response.body.accessToken).toBe('string');
            });
        });

        context('요청 body에 authorizeCode field가 빠진 경우', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        provider: TEST_PROVIDER,
                    })
                    .expect(400);
            });
        });

        context('요청 body에 provider field가 빠진 경우', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        authorizeCode: 'authorizeCode',
                    })
                    .expect(400);
            });
        });

        context('요청 body의 provider field 값이 google, kakao, naver 중 하나가 아닌 경우', () => {
            it('400 상태 코드를 반환해야 한다.', () => {
                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({
                        authorizeCode: 'authorizeCode',
                        provider: 'invalid_provider',
                    })
                    .expect(400);
            });
        });
    });
});
