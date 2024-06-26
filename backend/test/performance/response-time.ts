import { exec } from 'node:child_process';

import { promisify } from 'node:util';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { MockOauthService } from './__mocks__/oauth.service';

import { MockS3Service } from './__mocks__/s3.service';

import { createMockDogsForUsers, createMockUsers } from './utils/createMockEntity.util';

import { AppModule } from '../../src/app.module';
import { GoogleService } from '../../src/auth/oauth/google.service';
import { KakaoService } from '../../src/auth/oauth/kakao.service';
import { NaverService } from '../../src/auth/oauth/naver.service';
import { Dogs } from '../../src/dogs/dogs.entity';
import { S3Service } from '../../src/s3/s3.service';
import { Users } from '../../src/users/users.entity';
import { UsersDogs } from '../../src/users-dogs/users-dogs.entity';

const execPromisified = promisify(exec);

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

    await (async () => {
        await app.listen(process.env.PORT!, () => {
            console.log(`Test server running at http://${process.env.MYSQL_HOST}:${process.env.PORT}`);
        });
    })();

    dataSource = app.get(getDataSourceToken());
};

export const closeTestApp = async () => {
    await dataSource.destroy();
    await app.close();
};

export const insertTestData = async (n: number): Promise<void> => {
    const mockUsers = createMockUsers(n);
    const [mockDogs, mockUsersDogs] = createMockDogsForUsers(mockUsers);

    await dataSource.getRepository(Users).save(mockUsers);
    await dataSource.getRepository(Dogs).save(mockDogs);
    await dataSource.getRepository(UsersDogs).save(mockUsersDogs);

    console.log('Successfully inserted test data:');
    console.table([
        { Entity: 'Users', Count: n },
        { Entity: 'Dogs', Count: mockDogs.length },
        { Entity: 'UserDogs', Count: mockUsersDogs.length },
    ]);
};

export const deleteTestData = async (): Promise<void> => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');

    for (const entityMetadata of dataSource.entityMetadatas) {
        await dataSource.getRepository(entityMetadata.name).clear();
    }

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('Cleared all test data');
};

const runPostmanCollectionWithNewman = async (
    collectionId: string,
    requestOrFolderId: string,
    iterationCount: number,
): Promise<void> => {
    const command = `postman collection run ${collectionId} -i ${requestOrFolderId} -n ${iterationCount} --color on`;

    try {
        const { stdout, stderr } = await execPromisified(command, { encoding: 'utf8' });
        console.log('Postman collection executed successfully.');
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    } catch (error) {
        console.error(`Failed to execute Postman collection: ${error}`);
    }
};

const DATA_SIZE = parseInt(process.env.DATA_SIZE!);
const COLLECTION_ID = process.env.COLLECTION_ID!;
const REQUEST_OR_FOLDER_ID = process.env.REQUEST_OR_FOLDER_ID!;
const ITERATION_COUNT = parseInt(process.env.ITERATION_COUNT!);

const validateParameters = () => {
    if (isNaN(DATA_SIZE)) {
        throw new Error('DATA_SIZE가 정의되지 않았거나 유효한 숫자가 아닙니다. .env.test 파일을 수정해주세요.');
    }
    if (!COLLECTION_ID) {
        throw new Error('COLLECTION_ID가 정의되지 않았습니다. .env.test 파일을 수정해주세요.');
    }
    if (!REQUEST_OR_FOLDER_ID) {
        throw new Error('REQUEST_OR_FOLDER_ID가 정의되지 않았습니다. .env.test 파일을 수정해주세요.');
    }
    if (isNaN(ITERATION_COUNT)) {
        throw new Error('ITERATION_COUNT가 정의되지 않았거나 유효한 숫자가 아닙니다. .env.test 파일을 수정해주세요.');
    }
};

const runTests = async () => {
    validateParameters();
    await setupTestApp();

    try {
        await insertTestData(DATA_SIZE);
        await runPostmanCollectionWithNewman(COLLECTION_ID, REQUEST_OR_FOLDER_ID, ITERATION_COUNT);
    } catch (error) {
        console.error('Error during test execution:', error);
    } finally {
        await deleteTestData();
        await app.close();
    }
};

runTests();