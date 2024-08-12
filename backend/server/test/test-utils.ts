import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AllMethods } from 'supertest/types';

import { initializeTransactionalContext } from 'typeorm-transactional';

import { EXPIRED_ACCESS_TOKEN, INVALID_USER_ID_ACCESS_TOKEN, MALFORMED_ACCESS_TOKEN } from './constants';

import { INestApplication } from '../node_modules/@nestjs/common';
import { Test, TestingModule } from '../node_modules/@nestjs/testing';
import { getDataSourceToken } from '../node_modules/@nestjs/typeorm';

import { DataSource, In } from '../node_modules/typeorm';

import { AppModule } from '../src/app.module';

import { MockOauthService } from '../src/auth/oauth/__mocks__/oauth.service';
import { GoogleService } from '../src/auth/oauth/google.service';
import { KakaoService } from '../src/auth/oauth/kakao.service';
import { NaverService } from '../src/auth/oauth/naver.service';
import { DogWalkDay } from '../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../src/dogs/dogs.entity';
import { Excrements } from '../src/excrements/excrements.entity';
import { Journals } from '../src/journals/journals.entity';
import { JournalsDogs } from '../src/journals-dogs/journals-dogs.entity';
import { MockS3Service } from '../src/s3/__mocks__/s3.service';
import { S3Service } from '../src/s3/s3.service';
import { TodayWalkTime } from '../src/today-walk-time/today-walk-time.entity';
import { Users } from '../src/users/users.entity';
import { UsersDogs } from '../src/users-dogs/users-dogs.entity';

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

interface InsertMockUsersParams {
    mockUsers: Users | Users[];
}

// mockUsers 생성
export const insertMockUsers = async ({ mockUsers }: InsertMockUsersParams) => {
    mockUsers = Array.isArray(mockUsers) ? mockUsers : [mockUsers];

    await dataSource.getRepository(Users).save(mockUsers);
};

export const clearUsers = async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(Users).clear();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
};

interface InsertMockDogsParams {
    mockDogs: Dogs | Dogs[];
    userId: number;
}

// userId에게 mockDogs를 생성
export const insertMockDogs = async ({ mockDogs, userId }: InsertMockDogsParams) => {
    mockDogs = Array.isArray(mockDogs) ? mockDogs : [mockDogs];

    const mockUsersDog = mockDogs.map((dog) => ({ userId, dogId: dog.id }));

    await dataSource.getRepository(Dogs).save(mockDogs);
    await dataSource.getRepository(UsersDogs).save(mockUsersDog);
};

export const clearDogs = async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(DogWalkDay).clear();
    await dataSource.getRepository(TodayWalkTime).clear();
    await dataSource.getRepository(Dogs).clear();
    await dataSource.getRepository(UsersDogs).clear();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
};

interface InsertMockJournalsParams {
    mockJournals: Journals | Journals[];
    dogId: number;
}

// dogId에게 mockJournals 생성
export const insertMockJournals = async ({ mockJournals, dogId }: InsertMockJournalsParams) => {
    mockJournals = Array.isArray(mockJournals) ? mockJournals : [mockJournals];

    const mockJournalsDog = mockJournals.map((journal) => ({ dogId, journalId: journal.id }));

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(Journals).save(mockJournals);
    await dataSource.getRepository(JournalsDogs).save(mockJournalsDog);
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
};

export const clearJournals = async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(JournalsDogs).clear();
    await dataSource.getRepository(Journals).clear();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
};

interface InsertMockJournalWithPhotosAndExcrementsParams {
    mockJournal: Journals;
    dogIds: number | number[];
}

// dogIds에게 mockJournal 생성
export const insertMockJournalWithPhotosAndExcrements = async ({
    mockJournal,
    dogIds,
}: InsertMockJournalWithPhotosAndExcrementsParams) => {
    dogIds = Array.isArray(dogIds) ? dogIds : [dogIds];

    const mockJournalDogs = dogIds.map((dogId) => ({ dogId, journalId: mockJournal.id }));

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(Journals).save(mockJournal);
    await dataSource.getRepository(JournalsDogs).save(mockJournalDogs);
    await dataSource.getRepository(DogWalkDay).update({ id: In(dogIds) }, { wed: 1 });
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
};

export const clearJournal = async ({ dogIds }: Pick<InsertMockJournalWithPhotosAndExcrementsParams, 'dogIds'>) => {
    dogIds = Array.isArray(dogIds) ? dogIds : [dogIds];

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(DogWalkDay).update({ id: In(dogIds) }, { wed: 0 });
    await dataSource.getRepository(Excrements).clear();
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
