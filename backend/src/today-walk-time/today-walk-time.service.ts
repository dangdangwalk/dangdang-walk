import { Injectable, NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { FindManyOptions, FindOptionsWhere, In, UpdateResult } from 'typeorm';
import { TodayWalkTime } from './today-walk-time.entity';
import { TodayWalkTimeRepository } from './today-walk-time.repository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

    async delete(where: FindOptionsWhere<TodayWalkTime>) {
        return this.todayWalkTimeRepository.delete(where);
    }

    async update(
        where: FindOptionsWhere<TodayWalkTime>,
        partialEntity: QueryDeepPartialEntity<TodayWalkTime>
    ): Promise<UpdateResult> {
        return this.todayWalkTimeRepository.update(where, partialEntity);
    }

    async getWalkTimeList(walkTimeIds: number[]) {
        const walkTimeList = await this.todayWalkTimeRepository.find({ where: { id: In(walkTimeIds) } });
        if (!walkTimeList.length) {
            const error = new NotFoundException(`No walkTime found for the provided IDs: ${walkTimeIds}.`);
            this.logger.error(`No walkTime found for the provided IDs: ${walkTimeIds}.`, error.stack ?? 'No stack');
            throw error;
        }
        return walkTimeList.map((cur) => {
            return cur.duration;
        });
    }
}
