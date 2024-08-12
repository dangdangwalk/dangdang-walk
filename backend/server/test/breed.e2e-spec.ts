import * as fs from 'node:fs';

import * as request from 'supertest';

import { closeTestApp, setupTestApp } from './test-utils';

import { INestApplication } from '../node_modules/@nestjs/common';

import { Breed } from '../src/breed/breed.entity';

describe('BreedController (e2e)', () => {
    let app: INestApplication;
    let breeds: Omit<Breed, 'id'>[];

    beforeAll(async () => {
        ({ app } = await setupTestApp());

        const jsonData = fs.readFileSync('./resources/breedData.json', 'utf-8');
        breeds = JSON.parse(jsonData);
    });

    afterAll(async () => {
        await closeTestApp();
    });

    describe('/breeds (GET)', () => {
        context('견종 목록 가져오기 요청을 보내면', () => {
            it('200 상태 코드와 견종 목록을 반환해야 한다.', async () => {
                const response = await request(app.getHttpServer()).get('/breeds').expect(200);

                expect(response.body).toEqual(breeds.map((breed) => breed.koreanName));
            });
        });
    });
});
