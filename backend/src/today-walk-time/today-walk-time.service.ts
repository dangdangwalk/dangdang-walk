import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { getStartOfToday } from '../utils/date.util';
import { TodayWalkTime } from './today-walk-time.entity';
import { TodayWalkTimeRepository } from './today-walk-time.repository';

@Injectable()
export class TodayWalkTimeService {
    constructor(
        private readonly todayWalkTimeRepository: TodayWalkTimeRepository,
        private readonly logger: WinstonLoggerService,
    ) {}

    async delete(where: FindOptionsWhere<TodayWalkTime>) {
        return this.todayWalkTimeRepository.delete(where);
    }

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
        for (const curWalkTimeId of todayWalkTimeIds) {
            const walkTimeInfo = await this.todayWalkTimeRepository.findOne({ id: curWalkTimeId });
            const updateDuration = operation(walkTimeInfo.duration, duration);
            this.todayWalkTimeRepository.update({ id: curWalkTimeId }, { duration: updateDuration });
        }
    }

    async getWalkTimeList(walkTimeIds: number[]) {
        const walkTimeListBeforeCheck = await this.todayWalkTimeRepository.find({ where: { id: In(walkTimeIds) } });
        if (!walkTimeListBeforeCheck.length) {
            const error = new NotFoundException(`No walkTime found for the provided IDs: ${walkTimeIds}.`);
            this.logger.error(`No walkTime found for the provided IDs: ${walkTimeIds}.`, {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }

        for (const curWalkTime of walkTimeListBeforeCheck) {
            await this.checkDayPassed(curWalkTime.id, curWalkTime.updatedAt);
        }

        const walkTimeList = await this.todayWalkTimeRepository.find({ where: { id: In(walkTimeIds) } });
        return walkTimeList.map((cur) => {
            return cur.duration;
        });
    }
}
