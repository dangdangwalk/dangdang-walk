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

    //TODO: 이름에 update 넣어서 명확하게 하기
    private async checkDayPassed(walkTimeId: number, updatedAt: Date) {
        const startOfToday = getStartOfToday();
        if (updatedAt < startOfToday) {
            await this.todayWalkTimeRepository.update({ id: walkTimeId }, { duration: 0 });
        }
    }

    async updateDurations(
        walkTimeIds: number[],
        duration: number,
        operation: (current: number, operand: number) => number,
    ): Promise<void> {
        //TODO: batch 업데이트
        const todayWalkTimes = await this.findWalkTimesByIds(walkTimeIds);
        if (!walkTimeIds.length) {
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

    async getWalkDurations(walkTimeIds: number[]): Promise<number[]> {
        const todayWalkTimes = await this.findWalkTimesByIds(walkTimeIds);
        if (!todayWalkTimes.length) {
            const error = new NotFoundException(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`);
            this.logger.error(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`, {
                trace: error.stack ?? '스택 없음',
            });
            throw error;
        }
        //TODO: batch 업데이트 되게 바꾸기
        for (const currentTodayWalk of todayWalkTimes) {
            await this.checkDayPassed(currentTodayWalk.id, currentTodayWalk.updatedAt);
        }

        return todayWalkTimes.map((todayWalkTime) => {
            return todayWalkTime.duration;
        });
    }

    private async findWalkTimesByIds(walkTimeIds: number[]): Promise<TodayWalkTime[]> {
        return await this.todayWalkTimeRepository.find({ where: { id: In(walkTimeIds) } });
    }
}
