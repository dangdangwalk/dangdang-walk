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
