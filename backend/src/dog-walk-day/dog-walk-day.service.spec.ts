import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, UpdateResult } from 'typeorm';

import { DogWalkDay } from './dog-walk-day.entity';
import { DogWalkDayRepository } from './dog-walk-day.repository';
import { DogWalkDayService } from './dog-walk-day.service';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { mockDogWalkDay } from '../fixtures/dogWalkDays.fixture';

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
