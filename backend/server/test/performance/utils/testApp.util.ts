import { INestApplication } from 'server/src/node_modules/@nestjs/common';
import { Test, TestingModule } from 'server/src/node_modules/@nestjs/testing';
import { getDataSourceToken } from 'server/src/node_modules/@nestjs/typeorm';
import * as cookieParser from 'server/src/node_modules/@types/cookie-parser';
import { DataSource, EntityMetadata } from 'server/src/node_modules/typeorm';
import { Transactional, initializeTransactionalContext } from 'typeorm-transactional';

import { CreateMockEntity } from './createMockEntity.util';

import { AppModule } from '../../../src/app.module';
import { AuthService } from '../../../src/auth/auth.service';
import { GoogleService } from '../../../src/auth/oauth/google.service';
import { KakaoService } from '../../../src/auth/oauth/kakao.service';
import { NaverService } from '../../../src/auth/oauth/naver.service';
import { S3Service } from '../../../src/s3/s3.service';
import { color } from '../../../src/utils/ansi.util';
import { MockAuthService } from '../__mocks__/auth.service';
import { MockOauthService } from '../__mocks__/oauth.service';
import { MockS3Service } from '../__mocks__/s3.service';

export class TestApp {
    app: INestApplication;
    dataSource: DataSource;

    async start(): Promise<void> {
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
            .overrideProvider(AuthService)
            .useClass(MockAuthService)
            .compile();

        this.app = moduleFixture.createNestApplication();

        this.app.use(cookieParser());

        await (async () => {
            await this.app.listen(process.env.PORT!, () => {
                console.log(`Test server running at http://${process.env.MYSQL_HOST}:${process.env.PORT}`);
            });
        })();

        this.dataSource = this.app.get(getDataSourceToken());

        console.log(`Connected database:`, color(process.env.MYSQL_DATABASE!, 'Yellow'));
    }

    async terminate(): Promise<void> {
        console.log('Close connection with the database');
        await this.dataSource.destroy();

        console.log('Terminate the test application');
        await this.app.close();
    }

    @Transactional()
    async insertTestData(n: number): Promise<void> {
        await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');

        const mockEntityCreator = new CreateMockEntity(this.dataSource, n);

        const startTime = Date.now();

        const [userResults, dogResults] = await Promise.all([
            mockEntityCreator.createMockUsers(),
            mockEntityCreator.createMockDogs(),
        ]);
        const journalResults = await mockEntityCreator.createMockJournals();

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`Successfully inserted test data (${color(`+${duration}ms`, 'Cyan')}):`);

        await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

        const table = [...userResults, ...dogResults, ...journalResults];
        const totalSize = table.reduce((count, entity) => count + entity.Count, 0);

        console.table(table);
        console.log('Total data size:', totalSize);
    }

    async clearTestData(
        options: {
            keepSeedData?: boolean; // default false
        } = {},
    ): Promise<void> {
        const { keepSeedData = false } = options;

        const entityMetadatas: EntityMetadata[] = keepSeedData
            ? this.dataSource.entityMetadatas.filter(
                  (entityMetadata: EntityMetadata) => entityMetadata.name !== 'Breed',
              )
            : this.dataSource.entityMetadatas;

        await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');

        for (const entityMetadata of entityMetadatas) {
            await this.dataSource.getRepository(entityMetadata.name).clear();
        }

        await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

        console.log('Cleared all test data');
    }
}
