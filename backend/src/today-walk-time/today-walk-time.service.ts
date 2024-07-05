import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In, UpdateResult } from 'typeorm';

import { TodayWalkTime } from './today-walk-time.entity';

import { TodayWalkTimeRepository } from './today-walk-time.repository';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { getStartOfToday } from '../utils/date.util';

@Injectable()
export class TodayWalkTimeService {
    constructor(
        private readonly todayWalkTimeRepository: TodayWalkTimeRepository,
        private readonly logger: WinstonLoggerService,
    ) {}

    async delete(where: FindOptionsWhere<TodayWalkTime>) {
        return this.todayWalkTimeRepository.delete(where);
    }

    async updateIfStaleAndGetDuration(todayWalkTime: TodayWalkTime): Promise<number> {
        const startOfToday = getStartOfToday();

        if (todayWalkTime.updatedAt < startOfToday) {
            await this.todayWalkTimeRepository.update({ id: todayWalkTime.id }, { duration: 0 });
            return 0;
        }

        return todayWalkTime.duration;
    }

    async updateDurations(
        walkTimeIds: number[],
        duration: number,
        operation: (current: number, operand: number) => number,
    ): Promise<void> {
        //TODO: batch 업데이트
        const todayWalkTimes = await this.findWalkTimesByIds(walkTimeIds);
        if (!todayWalkTimes.length) {
            const error = new NotFoundException(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`);
            this.logger.error(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`, {
                trace: error.stack ?? '스택 없음',
            });
            throw error;
        }

        await Promise.all(
            todayWalkTimes.map(async (walkTime): Promise<UpdateResult> => {
                const updateDuration = operation(walkTime.duration, duration);

                return this.todayWalkTimeRepository.update({ id: walkTime.id }, { duration: updateDuration });
            }),
        );
    }

    private async findWalkTimesByIds(walkTimeIds: number[]): Promise<TodayWalkTime[]> {
        return await this.todayWalkTimeRepository.find({ where: { id: In(walkTimeIds) } });
    }
}
