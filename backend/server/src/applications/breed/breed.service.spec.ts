jest.mock('shared/database', () => ({
    TypeORMRepository: class {},
}));

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Cache } from 'cache-manager';

import { BreedRepository } from './breed.repository';
import { BreedService } from './breed.service';

const mockBreed = { id: 1, englishName: 'Poodle', koreanName: '푸들', recommendedWalkAmount: 60 };

const mockCacheManager: Partial<Cache> = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
};

const mockBreedRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
};

describe('BreedService', () => {
    let service: BreedService;
    let cacheManager: Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BreedService,
                {
                    provide: BreedRepository,
                    useValue: mockBreedRepository,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();

        service = module.get<BreedService>(BreedService);
        cacheManager = module.get(CACHE_MANAGER);

        jest.clearAllMocks();
    });

    describe('findOne', () => {
        context('견종 조회 할 때', () => {
            beforeEach(() => {
                mockBreedRepository.findOne.mockResolvedValue(mockBreed);
            });

            it('견종 정보를 반환해야 한다.', async () => {
                const breed = await service.findOne({ where: { id: 1 } });

                expect(breed).toEqual({
                    id: 1,
                    englishName: 'Poodle',
                    koreanName: '푸들',
                    recommendedWalkAmount: 60,
                });
            });
        });
    });

    describe('getKoreanNames', () => {
        const mockBreedList = [
            {
                englishName: 'Poodle',
                id: 1,
                koreanName: '푸들',
                recommendedWalkAmount: 60,
            },
            {
                englishName: 'Airedale Terrier',
                id: 2,
                koreanName: '에어데일 테리어',
                recommendedWalkAmount: 1800,
            },
        ];

        context('견종의 한국어 이름을 조회할 때', () => {
            beforeEach(() => {
                mockBreedRepository.find.mockResolvedValue(mockBreedList);
            });

            it('견종의 한국어 이름 리스트를 반환한다.', async () => {
                const breed = await service.getKoreanNames();

                expect(breed).toEqual(['푸들', '에어데일 테리어']);
            });

            it('결과를 캐시에 저장해야 한다.', async () => {
                await service.getKoreanNames();

                expect(cacheManager.set).toHaveBeenCalledWith(
                    'breeds:koreanNames',
                    ['푸들', '에어데일 테리어'],
                    expect.any(Number),
                );
            });
        });

        context('캐시에 데이터가 있으면', () => {
            beforeEach(() => {
                (cacheManager.get as jest.Mock).mockResolvedValue(['푸들', '에어데일 테리어']);
            });

            it('DB를 조회하지 않고 캐시된 값을 반환해야 한다.', async () => {
                const result = await service.getKoreanNames();

                expect(result).toEqual(['푸들', '에어데일 테리어']);
                expect(mockBreedRepository.find).not.toHaveBeenCalled();
            });
        });

        context('견종 목록이 존재하지 않으면', () => {
            beforeEach(() => {
                (cacheManager.get as jest.Mock).mockResolvedValue(null);
                mockBreedRepository.find.mockResolvedValue([]);
            });

            it('NotFoundException 예외를 던져야 한다.', async () => {
                await expect(service.getKoreanNames()).rejects.toThrow(
                    new NotFoundException('견종 목록을 찾을 수 없습니다.'),
                );
            });
        });
    });

    describe('getRecommendedWalkAmountList', () => {
        const mockBreedList = [
            {
                englishName: 'Poodle',
                id: 1,
                koreanName: '푸들',
                recommendedWalkAmount: 60,
            },
            {
                englishName: 'Airedale Terrier',
                id: 2,
                koreanName: '에어데일 테리어',
                recommendedWalkAmount: 1800,
            },
        ];

        const breedIds = [1, 2];
        const not_exist_BreedIds = [999, 1000];

        beforeEach(() => {
            mockBreedRepository.find.mockResolvedValue(mockBreedList);
        });

        context('견종 id가 주어지면', () => {
            it('해당 견종의 권장 산책량 리스트를 반환해야 한다.', async () => {
                const recommendWalk = await service.getRecommendedWalkAmountList(breedIds);

                expect(recommendWalk).toEqual([60, 1800]);
            });
        });

        context('견종 id가 존재하지 않으면', () => {
            it('NotFoundException 예외를 던져야 한다.', async () => {
                await expect(service.getRecommendedWalkAmountList(not_exist_BreedIds)).rejects.toThrow(
                    new NotFoundException('999에 대한 권장 산책량을 찾을 수 없습니다.'),
                );
            });
        });

        context('견종 목록이 빈 값이면', () => {
            beforeEach(() => {
                mockBreedRepository.find.mockResolvedValue([]);
            });
            it('NotFoundException 예외를 던져야 한다.', async () => {
                await expect(service.getRecommendedWalkAmountList(not_exist_BreedIds)).rejects.toThrow(
                    new NotFoundException('999,1000 해당 견종을 찾을 수 없습니다.'),
                );
            });
        });
    });
});
