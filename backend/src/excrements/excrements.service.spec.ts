import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';

import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { ExcrementsService } from './excrements.service';
import { FakeExcrementsService } from './fake-excrements.service';

describe('ExcrementsService', () => {
    let service: ExcrementsService;
    let excrementsRepository: Repository<Excrements>;

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

        service = module.get<ExcrementsService>(ExcrementsService);
        excrementsRepository = module.get<Repository<Excrements>>(getRepositoryToken(Excrements));
    });

    describe('getExcrementsCount', () => {
        const mockExcrements: Excrements[] = [
            new Excrements({
                journalId: 1,
                dogId: 1,
                type: 'URINE',
                coordinate: 'POINT(126.977948 37.566667)',
            }),
            new Excrements({
                journalId: 1,
                dogId: 1,
                type: 'FECES',
                coordinate: 'POINT(12.4924 41.8902)',
            }),
            new Excrements({
                journalId: 1,
                dogId: 1,
                type: 'FECES',
                coordinate: 'POINT(12.4924 41.8902)',
            }),
        ];

        beforeEach(() => {
            jest.spyOn(excrementsRepository, 'find').mockImplementation((options?: FindManyOptions<Excrements>) => {
                if (!options?.where) {
                    return Promise.resolve(mockExcrements);
                }

                const { journalId, dogId, type } = options.where as Record<string, unknown>;

                return Promise.resolve(
                    mockExcrements.filter(
                        (excrement) =>
                            (journalId === undefined || excrement.journalId === journalId) &&
                            (dogId === undefined || excrement.dogId === dogId) &&
                            (type === undefined || excrement.type === type),
                    ),
                );
            });
        });

        context('특정 journalId와 dogId에 대해 Type이 FECES인 경우', () => {
            it('해당 조건의 대변 기록 수를 정확히 반환해야 한다.', async () => {
                const excrements = await service.getExcrementsCount(1, 1, 'FECES');

                expect(excrements).toBe(2);
            });
        });

        context('특정 journalId와 dogId에 대해 Type이 URINE인 경우', () => {
            it('해당 조건의 소변 기록 수를 정확히 반환해야 한다', async () => {
                const excrements = await service.getExcrementsCount(1, 1, 'URINE');

                expect(excrements).toBe(1);
            });
        });

        context('존재하지 않는 journalId, dogId, 또는 일치하지 않는 Type으로 조회할 때', () => {
            it('배변 기록이 없으므로 0을 반환해야 한다', async () => {
                const excrements = await service.getExcrementsCount(999, 99, 'URINE');

                expect(excrements).toBe(0);
            });
        });
    });

    describe('createNewExcrements', () => {
        context('유효한 데이터로 새로운 배변 기록을 생성할 때', () => {
            it('속성을 가진 새로운 Excrements 객체를 반환해야 한다', async () => {
                const excrements = await service.createNewExcrements(1, 1, 'FECES', {
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
