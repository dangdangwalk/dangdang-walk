import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, UpdateResult } from 'typeorm';

import { DogWalkDay } from './dog-walk-day.entity';
import { DogWalkDayRepository } from './dog-walk-day.repository';
import { DogWalkDayService } from './dog-walk-day.service';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { mockDogWalkDay, mockDogWalkDays } from '../fixtures/dogWalkDays.fixture';

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
                    useClass: Repository,
                },
            ],
        }).compile();

        dogWalkDayService = module.get<DogWalkDayService>(DogWalkDayService);
        repository = module.get<Repository<DogWalkDay>>(getRepositoryToken(DogWalkDay));
    });

    describe('getWalkDayList', () => {
        beforeEach(() => {
            jest.spyOn(repository, 'find').mockResolvedValue(mockDogWalkDays);
            jest.spyOn(dogWalkDayService, 'resetWeeklyCount').mockResolvedValue();
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
                    new NotFoundException('id가 인 레코드를 찾을 수 없습니다'),
                );
            });
        });
    });

    describe('updateDailyWalkCount', () => {
        context('dogWalkDayIds가 주어지면', () => {
            const dogWalkDayIds = [1, 2, 3];

            beforeEach(() => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockDogWalkDay);
            });

            it('update 메서드가 dogWalkDayIds 횟수만큼 호출된다..', async () => {
                const updateSpy = jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);

                await dogWalkDayService.updateDailyWalkCount(dogWalkDayIds, () => 1);

                expect(updateSpy).toHaveBeenCalledTimes(3);
            });
        });
    });
});
