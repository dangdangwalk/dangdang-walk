import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, FindOperator, Repository, UpdateResult } from 'typeorm';

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

    describe('updateDurations', () => {
        beforeEach(() => {
            jest.spyOn(todayWalkTimeRepository, 'find').mockImplementation(createMockFindImplementation());
            jest.spyOn(todayWalkTimeRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);
        });

        context('존재하지 않는 walkTimeIds가 주어지면', () => {
            it('NotFoundException 예외를 던져야 한다.', async () => {
                await expect(
                    service.updateDurations([99, 100], 10, (current: number, operand: number) => current + operand),
                ).rejects.toThrow(new NotFoundException('id: 99,100와 일치하는 레코드가 없습니다'));
            });
        });
    });

    const createMockFindImplementation = () => {
        return (options?: FindManyOptions<TodayWalkTime>) => {
            if (!options?.where) {
                return Promise.resolve(mockWalkTimes);
            }

            const whereClause = options.where as Record<string, unknown>;
            const findOperator = whereClause.id as FindOperator<number[]>;
            const idList = (findOperator as any)._value;

            return Promise.resolve(mockWalkTimes.filter((walkTime) => idList.includes(walkTime.id)));
        };
    };
});
