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
import { DogWalkDay } from '../src/dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../src/dogs/dogs.entity';
import { mockDog, mockDog2 } from '../src/fixtures/dogs.fixture';
import { mockUser } from '../src/fixtures/users.fixture';
import { MockS3Service } from '../src/s3/__mocks__/s3.service';
import { S3Service } from '../src/s3/s3.service';
import { TodayWalkTime } from '../src/today-walk-time/today-walk-time.entity';
import { UsersDogs } from '../src/users-dogs/users-dogs.entity';
import { Users } from '../src/users/users.entity';
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

export const insertMockUser = async () => {
    const usersRepository = dataSource.getRepository(Users);
    await usersRepository.save(mockUser);
};

export const clearUsers = async () => {
    const usersRepository = dataSource.getRepository(Users);
    await usersRepository.query('SET FOREIGN_KEY_CHECKS = 0;');
    await usersRepository.clear();
    await usersRepository.query('SET FOREIGN_KEY_CHECKS = 1;');
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
    const dogsRepository = dataSource.getRepository(Dogs);
    await dogsRepository.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.getRepository(DogWalkDay).clear();
    await dataSource.getRepository(TodayWalkTime).clear();
    await dogsRepository.clear();
    await dataSource.getRepository(UsersDogs).clear();
    await dogsRepository.query('SET FOREIGN_KEY_CHECKS = 1;');
};
