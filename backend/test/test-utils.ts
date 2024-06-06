import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { MockOauthService } from '../src/auth/oauth/__mocks__/oauth.service';
import { GoogleService } from '../src/auth/oauth/google.service';
import { KakaoService } from '../src/auth/oauth/kakao.service';
import { NaverService } from '../src/auth/oauth/naver.service';
import { AppModule } from './../src/app.module';

let app: INestApplication;
let dataSource: DataSource;

export const setupTestApp = async () => {
    initializeTransactionalContext();

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(GoogleService)
        .useValue(MockOauthService)
        .overrideProvider(KakaoService)
        .useValue(MockOauthService)
        .overrideProvider(NaverService)
        .useValue(MockOauthService)
        .compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    await app.init();

    dataSource = app.get(getDataSourceToken());

    return { app, dataSource };
};

export const closeTestApp = async () => {
    await dataSource.destroy();
    await app.close();
};

// Access token with maxAge = 100 years, userId = 1, provider = kakao
export const VALID_ACCESS_TOKEN_100_YEARS =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInByb3ZpZGVyIjoia2FrYW8iLCJpYXQiOjE3MTYxODc5NzAsImV4cCI6NDg3MTk0Nzk3MH0.QlL_1luAr4T-YdA5QfKl8_ivhAlE1_FFlRfSAq2u2Lc';
export const EXPIRED_ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInByb3ZpZGVyIjoia2FrYW8iLCJpYXQiOjE3MTc1OTQ4NTYsImV4cCI6MTcxNzU5NDg2Nn0.KphkJf-oCeJoZTv3fw-XvI5Qo16058r_ak5lWCJrvmg';
export const MALFORMED_ACCESS_TOKEN = 'malformed_access_token';

// Refresh token with maxAge = 100 years, oauthId = 12345, provider = kakao
export const VALID_REFRESH_TOKEN_100_YEARS =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvYXV0aElkIjoiMTIzNDUiLCJwcm92aWRlciI6Imtha2FvIiwiaWF0IjoxNzE3NjAwNzIzLCJleHAiOjQ4NzMzNjA3MjN9.4FVH0-mkQ_qf4J0lmdu9lBrTrOYNk13fy7TJSjyyPV4';
export const EXPIRED_REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvYXV0aElkIjoiMTIzNDUiLCJwcm92aWRlciI6Imtha2FvIiwiaWF0IjoxNzE3NjAwNzczLCJleHAiOjE3MTc2MDA3Nzh9.ESo_BdU8g2K5YayZkkRPw5v6AKPJwx-p6R7_RA1QUvg';
export const MALFORMED_REFRESH_TOKEN = 'malformed_refresh_token';

export const VALID_PROVIDER_KAKAO = 'kakao';
export const INVALID_PROVIDER = 'invalid_provider';
