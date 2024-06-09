import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { closeTestApp, setupTestApp } from './test-utils';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        ({ app } = await setupTestApp());
    });

    afterAll(async () => {
        await closeTestApp();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
    });
});
