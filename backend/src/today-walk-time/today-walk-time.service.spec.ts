import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, FindOperator, Repository } from 'typeorm';

import { TodayWalkTime } from './today-walk-time.entity';
import { TodayWalkTimeRepository } from './today-walk-time.repository';
import { TodayWalkTimeService } from './today-walk-time.service';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';

describe('ExcrementsService', () => {
    let service: TodayWalkTimeService;
    let todayWalkTimeRepository: Repository<TodayWalkTime>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TodayWalkTimeRepository,
                TodayWalkTimeService,
                WinstonLoggerService,
                EntityManager,
                {
                    provide: getRepositoryToken(TodayWalkTime),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<TodayWalkTimeService>(TodayWalkTimeService);
        todayWalkTimeRepository = module.get<Repository<TodayWalkTime>>(getRepositoryToken(TodayWalkTime));
    });

    describe('getWalkDurations', () => {
        const mockWalkTimes: TodayWalkTime[] = [
            {
                id: 1,
                duration: 4109,
                updatedAt: new Date('2024-06-23T00:00:00Z'),
                setUpdatedAtBeforeUpdate: function (): void {
                    this.updatedAt = new Date();
                },
            },
            {
                id: 2,
                duration: 5000,
                updatedAt: new Date('2024-06-23T05:17:07.000Z'),
                setUpdatedAtBeforeUpdate: function (): void {
                    this.updatedAt = new Date();
                },
            },
            {
                id: 3,
                duration: 5,
                updatedAt: new Date('2024-06-23T05:17:07.000Z'),
                setUpdatedAtBeforeUpdate: function (): void {
                    this.updatedAt = new Date();
                },
            },
        ];

        beforeEach(() => {
            jest.spyOn(todayWalkTimeRepository, 'find').mockImplementation(
                (options?: FindManyOptions<TodayWalkTime>) => {
                    if (!options?.where) {
                        return Promise.resolve(mockWalkTimes);
                    }

                    const whereClause = options.where as Record<string, unknown>;
                    const findOperator = whereClause.id as FindOperator<number[]>;
                    const idList = (findOperator as any)._value;

                    return Promise.resolve(mockWalkTimes.filter((walkTime) => idList.includes(walkTime.id)));
                },
            );
        });

        context('특정 walkTimeIds가 주어지면', () => {
            it('해당 ID들의 duration을 정확히 반환해야 한다.', async () => {
                const excrements = await service.getWalkDurations([1, 2]);

                expect(excrements).toEqual([4109, 5000]);
            });
        });

        context('존재하지 않는 walkTimeId가 주어지면', () => {
            it('NotFoundException 예외를 던져야 한다.', async () => {
                await expect(service.getWalkDurations([0])).rejects.toThrow(
                    new NotFoundException('id: 0와 일치하는 레코드가 없습니다'),
                );
            });
        });
    });
});
