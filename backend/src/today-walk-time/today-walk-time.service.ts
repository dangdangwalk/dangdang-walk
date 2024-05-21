import { Injectable, NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { FindOptionsWhere, In } from 'typeorm';
import { TodayWalkTime } from './today-walk-time.entity';
import { TodayWalkTimeRepository } from './today-walk-time.repository';

@Injectable()
export class TodayWalkTimeService {
    constructor(
        private readonly todayWalkTimeRepository: TodayWalkTimeRepository,
        private readonly logger: WinstonLoggerService
    ) {}

    async find(where: FindOptionsWhere<TodayWalkTime>): Promise<TodayWalkTime[]> {
        return this.todayWalkTimeRepository.find({ where });
    }

    async delete(where: FindOptionsWhere<TodayWalkTime>) {
        return this.todayWalkTimeRepository.delete(where);
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
