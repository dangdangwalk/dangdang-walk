import { Injectable, NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { getStartOfToday } from 'src/utils/date.util';
import { FindManyOptions, FindOptionsWhere, In, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { TodayWalkTime } from './today-walk-time.entity';
import { TodayWalkTimeRepository } from './today-walk-time.repository';

@Injectable()
export class TodayWalkTimeService {
    constructor(
        private readonly todayWalkTimeRepository: TodayWalkTimeRepository,
        private readonly logger: WinstonLoggerService
    ) {}

    async find(where: FindManyOptions<TodayWalkTime>): Promise<TodayWalkTime[]> {
        return this.todayWalkTimeRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<TodayWalkTime>): Promise<TodayWalkTime> {
        return this.todayWalkTimeRepository.findOne(where);
    }

    async update(
        where: FindOptionsWhere<TodayWalkTime>,
        partialEntity: QueryDeepPartialEntity<TodayWalkTime>
    ): Promise<UpdateResult> {
        return this.todayWalkTimeRepository.update(where, partialEntity);
    }

    async delete(where: FindOptionsWhere<TodayWalkTime>) {
        return this.todayWalkTimeRepository.delete(where);
    }

    async checkDayPassed(walkTimeId: number, updatedAt: Date) {
        const startOfToday = getStartOfToday();
        if (updatedAt < startOfToday) {
            await this.update({ id: walkTimeId }, { duration: 0 });
        }
    }

    async updateDurations(
        todayWalkTimeIds: number[],
        duration: number,
        operation: (current: number, operand: number) => number
    ) {
        for (const curWalkTimeId of todayWalkTimeIds) {
            const walkTimeInfo = await this.findOne({ id: curWalkTimeId });
            const updateDuration = operation(walkTimeInfo.duration, duration);
            this.update({ id: curWalkTimeId }, { duration: updateDuration });
        }
    }

    async getWalkTimeList(walkTimeIds: number[]) {
        const walkTimeListBeforeCheck = await this.todayWalkTimeRepository.find({ where: { id: In(walkTimeIds) } });
        if (!walkTimeListBeforeCheck.length) {
            const error = new NotFoundException(`No walkTime found for the provided IDs: ${walkTimeIds}.`);
            this.logger.error(`No walkTime found for the provided IDs: ${walkTimeIds}.`, error.stack ?? 'No stack');
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
