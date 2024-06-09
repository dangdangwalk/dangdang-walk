import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { AllMethods } from 'supertest/types';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './../src/app.module';

import { EXPIRED_ACCESS_TOKEN, INVALID_USER_ID_ACCESS_TOKEN, MALFORMED_ACCESS_TOKEN } from './constants';

import { MockOauthService } from '../src/auth/oauth/__mocks__/oauth.service';
import { GoogleService } from '../src/auth/oauth/google.service';
import { KakaoService } from '../src/auth/oauth/kakao.service';
import { NaverService } from '../src/auth/oauth/naver.service';
import { DogWalkDay } from '../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../src/dogs/dogs.entity';
import { mockDog, mockDog2 } from '../src/fixtures/dogs.fixture';
import { journalsDogEntries, journalsEntries } from '../src/fixtures/statistics.fixture';
import { mockUser } from '../src/fixtures/users.fixture';
import { JournalsDogs } from '../src/journals-dogs/journals-dogs.entity';
import { Journals } from '../src/journals/journals.entity';
import { MockS3Service } from '../src/s3/__mocks__/s3.service';
import { S3Service } from '../src/s3/s3.service';
import { TodayWalkTime } from '../src/today-walk-time/today-walk-time.entity';
import { UsersDogs } from '../src/users-dogs/users-dogs.entity';
import { Users } from '../src/users/users.entity';

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
        .overrideProvider(S3Service)
        .useValue(MockS3Service)
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

export const testUnauthorizedAccess = async (requestName: string, method: AllMethods, endpoint: string) => {
    context(`Authorization header 없이 ${requestName} 요청을 보내면`, () => {
        it('401 상태 코드를 반환해야 한다.', async () => {
            return request(app.getHttpServer())[method](endpoint).expect(401);
        });
    });

    context(`구조가 잘못된 access token을 Authorization header에 담아 ${requestName} 요청을 보내면`, () => {
        it('401 상태 코드를 반환해야 한다.', async () => {
            return request(app.getHttpServer())
                [method](endpoint)
                .set('Authorization', `Bearer ${MALFORMED_ACCESS_TOKEN}`)
                .expect(401);
        });
    });

    context(`만료된 access token을 Authorization header에 담아 ${requestName} 요청을 보내면`, () => {
        it('401 상태 코드를 반환해야 한다.', async () => {
            return request(app.getHttpServer())
                [method](endpoint)
                .set('Authorization', `Bearer ${EXPIRED_ACCESS_TOKEN}`)
                .expect(401);
        });
    });

    context(
        `존재하지 않는 userId를 가진 access token을 Authorization header에 담아 ${requestName} 요청을 보내면`,
        () => {
            it('401 상태 코드를 반환해야 한다.', async () => {
                return request(app.getHttpServer())
                    [method](endpoint)
                    .set('Authorization', `Bearer ${INVALID_USER_ID_ACCESS_TOKEN}`)
                    .expect(401);
            });
        },
    );
};

export const insertMockUser = async () => {
    await dataSource.getRepository(Users).save(mockUser);
};

export const clearUsers = async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(Users).clear();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
};

export const insertMockDogs = async () => {
    const dogsRepository = dataSource.getRepository(Dogs);
    const usersDogsRepository = dataSource.getRepository(UsersDogs);
    await dogsRepository.save(mockDog);
    await usersDogsRepository.save({ userId: 1, dogId: mockDog.id });
    await dogsRepository.save(mockDog2);
    await usersDogsRepository.save({ userId: 1, dogId: mockDog2.id });
};

export const clearDogs = async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(DogWalkDay).clear();
    await dataSource.getRepository(TodayWalkTime).clear();
    await dataSource.getRepository(Dogs).clear();
    await dataSource.getRepository(UsersDogs).clear();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
};

export const insertMockJournals = async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(Journals).save(journalsEntries);
    await dataSource.getRepository(JournalsDogs).save(journalsDogEntries);
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
};

export const clearJournals = async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(JournalsDogs).clear();
    await dataSource.getRepository(Journals).clear();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
};

export const setFakeDate = (fakeDate: Date) => {
    jest.useFakeTimers({
        /**
         * Fake only Date
         * 참고: https://jestjs.io/docs/jest-object#jestusefaketimersfaketimersconfig
         */
        doNotFake: [
            'hrtime',
            'nextTick',
            'performance',
            'queueMicrotask',
            'requestAnimationFrame',
            'cancelAnimationFrame',
            'requestIdleCallback',
            'cancelIdleCallback',
            'setImmediate',
            'clearImmediate',
            'setInterval',
            'clearInterval',
            'setTimeout',
            'clearTimeout',
        ],
        now: fakeDate,
    });
};

export const clearFakeDate = jest.useRealTimers;
