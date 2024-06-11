import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';

import { DogWalkDay } from './dog-walk-day.entity';

import { DogWalkDayRepository } from './dog-walk-day.repository';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { getLastSunday } from '../utils/date.util';

@Injectable()
export class DogWalkDayService {
    constructor(
        private readonly dogWalkDayRepository: DogWalkDayRepository,
        private readonly logger: WinstonLoggerService,
    ) {}

    async getWalkDayList(walkDayIds: number[]): Promise<number[][]> {
        const foundDays = await this.dogWalkDayRepository.find({ where: { id: In(walkDayIds) } });
        if (!foundDays.length) {
            this.logger.error('walkDayIds 데이터를 찾을 수 없습니다.', '');
            throw new NotFoundException('walkDayIds 값을 찾을 수 없습니다.');
        }

        const result: number[][] = [];
        for (const currentDay of foundDays) {
            await this.resetWeeklyCount(currentDay.updatedAt, currentDay.id);
            result.push(this.getDayCountOnly(currentDay));
        }

        return result;
    }

    async updateDailyWalkCount(dogWalkDayIds: number[], operation: (current: number) => number): Promise<void> {
        const weekDay = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
        const today = new Date().getDay();
        const day = weekDay[today];

        for (const dogWalkDayId of dogWalkDayIds) {
            const findDogWalkDay = await this.dogWalkDayRepository.findOne({ id: dogWalkDayId });
            const dogWalkDayCount = findDogWalkDay[day] as number;
            const updateCount = operation(dogWalkDayCount);

            await this.dogWalkDayRepository.update({ id: dogWalkDayId }, { [day]: updateCount });
        }
    }

    async delete(where: FindOptionsWhere<DogWalkDay>) {
        return this.dogWalkDayRepository.delete(where);
    }

    private getDayCountOnly(walkDay: DogWalkDay): number[] {
        const dayCountArray = [];
        for (const key in walkDay) {
            if (key !== 'id' && key !== 'updatedAt') {
                dayCountArray.push(walkDay[key] as number);
            }
        }

        return dayCountArray;
    }

    async resetWeeklyCount(updatedAt: Date, walkDayId: number) {
        const lastSunday = getLastSunday();
        if (updatedAt < lastSunday) {
            await this.dogWalkDayRepository.update(
                { id: walkDayId },
                { mon: 0, tue: 0, wed: 0, thr: 0, fri: 0, sat: 0, sun: 0 },
            );
        }
    }
}
