import { Injectable, NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { FindOptionsWhere, In } from 'typeorm';
import { DailyWalkTime } from './daily-walk-time.entity';
import { DailyWalkTimeRepository } from './daily-walk-time.repository';

@Injectable()
export class DailyWalkTimeService {
    constructor(
        private readonly dailyWalkTimeRepository: DailyWalkTimeRepository,
        private readonly logger: WinstonLoggerService
    ) {}

    async find(where: FindOptionsWhere<DailyWalkTime>): Promise<DailyWalkTime[]> {
        return this.dailyWalkTimeRepository.find(where);
    }

    async delete(where: FindOptionsWhere<DailyWalkTime>) {
        return this.dailyWalkTimeRepository.delete(where);
    }

    async getWalkTimeList(walkTimeIds: number[]) {
        const walkTimeList = await this.dailyWalkTimeRepository.find({ id: In(walkTimeIds) });
        if (!walkTimeList.length) {
            const e = new NotFoundException();
            this.logger.error(`No walkTime in table`, e.stack ?? 'No stack');
        }
        return walkTimeList.map((cur) => {
            return cur.duration;
        });
    }
}
