import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { DogWalkDay } from './dog-walk-day.entity';
import { DogWalkDayRepository } from './dog-walk-day.repository';
import { DogWalkDayService } from './dog-walk-day.service';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { mockDogWalkDays } from '../fixtures/dogWalkDays.fixture';

describe('DogWalkDayService', () => {
    let dogWalkDayService: DogWalkDayService;
    let repository: Repository<DogWalkDay>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DogWalkDayService,
                WinstonLoggerService,
                DogWalkDayRepository,
                EntityManager,
                {
                    provide: getRepositoryToken(DogWalkDay),
                    useValue: {
                        find: jest.fn(),
                        update: jest.fn(),
                    },
                },
            ],
        }).compile();

        dogWalkDayService = module.get<DogWalkDayService>(DogWalkDayService);
        repository = module.get<Repository<DogWalkDay>>(getRepositoryToken(DogWalkDay));
    });

    describe('getWalkDayList', () => {
        beforeEach(() => {
            jest.spyOn(repository, 'find').mockResolvedValue(mockDogWalkDays);
            jest.spyOn(dogWalkDayService, 'checkWeekPassed').mockResolvedValue();
        });

        context('walkDayIds 값이 주어지면', () => {
            it('WalkDay 요일별 값을 반환해야 한다.', async () => {
                const dogWalkDays = await dogWalkDayService.getWalkDayList([1, 2]);

                expect(dogWalkDays).toEqual([
                    [2, 1, 3, 0, 4, 2, 1],
                    [1, 2, 1, 3, 2, 1, 0],
                ]);
            });
        });

        context('올바른 값이 주어지지 않으면', () => {
            beforeEach(() => {
                jest.spyOn(repository, 'find').mockResolvedValue([]);
            });

            it('NotFoundException 던져야 한다.', async () => {
                await expect(dogWalkDayService.getWalkDayList([])).rejects.toThrow(
                    new NotFoundException('walkDayIds 값을 찾을 수 없습니다.'),
                );
            });
        });
    });
});
