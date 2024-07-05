import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { ExcrementsService } from './excrements.service';
import { FakeExcrementsService } from './fake-excrements.service';

describe('ExcrementsService', () => {
    let excrementsService: ExcrementsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExcrementsRepository,
                EntityManager,
                {
                    provide: getRepositoryToken(Excrements),
                    useClass: Repository,
                },
                {
                    provide: ExcrementsService,
                    useClass: FakeExcrementsService,
                },
            ],
        }).compile();

        excrementsService = module.get<ExcrementsService>(ExcrementsService);
    });

    describe('createNewExcrements', () => {
        context('유효한 데이터로 새로운 배변 기록을 생성할 때', () => {
            it('속성을 가진 새로운 Excrements 객체를 반환해야 한다', async () => {
                const excrements = await excrementsService.createNewExcrements(1, 1, 'FECES', {
                    lat: '126.9780',
                    lng: '37.5665',
                });

                expect(excrements).toEqual({
                    coordinate: 'POINT(126.9780 37.5665)',
                    dog: undefined,
                    dogId: 1,
                    id: 1,
                    journal: undefined,
                    journalId: 1,
                    type: 'FECES',
                });
            });
        });
    });
});
