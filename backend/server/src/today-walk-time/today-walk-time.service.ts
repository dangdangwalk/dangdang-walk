import { Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager, FindOptionsWhere, In } from 'typeorm';

import { TodayWalkTime } from './today-walk-time.entity';

import { TodayWalkTimeRepository } from './today-walk-time.repository';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { UpdateTodayWalkTimeOperation } from '../journals/types/journal.types';
import { getStartOfToday } from '../utils/date.util';

@Injectable()
export class TodayWalkTimeService {
    constructor(
        private readonly todayWalkTimeRepository: TodayWalkTimeRepository,
        private readonly logger: WinstonLoggerService,
        private readonly entityManager: EntityManager,
    ) {}

    async delete(where: FindOptionsWhere<TodayWalkTime>) {
        return await this.todayWalkTimeRepository.delete(where);
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
        operation: UpdateTodayWalkTimeOperation,
    ): Promise<void> {
        const todayWalkTimes = await this.findWalkTimesByIds(walkTimeIds);
        if (!todayWalkTimes.length) {
            const error = new NotFoundException(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`);
            this.logger.error(`id: ${walkTimeIds}와 일치하는 레코드가 없습니다`, {
                trace: error.stack ?? '스택 없음',
            });
            throw error;
        }

        const updateEntities: Partial<TodayWalkTime>[] = todayWalkTimes.map(
            (cur) => new TodayWalkTime({ id: cur.id, duration: operation(cur.duration, duration) }),
        );

        await this.entityManager
            .createQueryBuilder(TodayWalkTime, 'todayWalkTime')
            .insert()
            .into(TodayWalkTime, ['id', 'duration'])
            .values(updateEntities)
            .orUpdate(['duration'], ['id'])
            .execute();
    }

    private async findWalkTimesByIds(walkTimeIds: number[]): Promise<TodayWalkTime[]> {
        return await this.todayWalkTimeRepository.find({ where: { id: In(walkTimeIds) } });
    }
}
