import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';

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
        todayWalkTimeIds: number[],
        duration: number,
        operation: (current: number, operand: number) => number,
    ) {
        //TODO: batch 업데이트
        for (const curWalkTimeId of todayWalkTimeIds) {
            const walkTimeInfo = await this.todayWalkTimeRepository.findOne({ id: curWalkTimeId });
            const updateDuration = operation(walkTimeInfo.duration, duration);
            this.todayWalkTimeRepository.update({ id: curWalkTimeId }, { duration: updateDuration });
        }
    }

    async getWalkDurations(walkTimeIds: number[]): Promise<number[]> {
        const todayWalkTimes = await this.todayWalkTimeRepository.find({ where: { id: In(walkTimeIds) } });
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
}
