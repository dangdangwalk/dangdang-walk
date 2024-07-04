import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

import { DogWalkDay } from './dog-walk-day.entity';

import { DogWalkDayRepository } from './dog-walk-day.repository';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { getLastSunday } from '../utils/date.util';
import { makeSubObject } from '../utils/manipulate.util';

@Injectable()
export class DogWalkDayService {
    constructor(
        private readonly dogWalkDayRepository: DogWalkDayRepository,
        private readonly logger: WinstonLoggerService,
    ) {}

    async updateIfStaleAndGetWeeklyWalks(dogWalkDay: DogWalkDay): Promise<number[]> {
        const lastSunday = getLastSunday();

        if (dogWalkDay.updatedAt < lastSunday) {
            const weeklyCountReset = { mon: 0, tue: 0, wed: 0, thr: 0, fri: 0, sat: 0, sun: 0 };
            await this.dogWalkDayRepository.update({ id: dogWalkDay.id }, weeklyCountReset);
            return Object.values(weeklyCountReset);
        }

        return Object.values(makeSubObject(dogWalkDay, ['mon', 'tue', 'wed', 'thr', 'fri', 'sat', 'sun']));
    }

    async updateDailyWalkCount(dogWalkDayIds: number[], operation: (current: number) => number): Promise<void> {
        const weekDay = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
        const today = new Date().getDay();
        const day = weekDay[today];

        //TODO: for 문을 안 쓰는 방향으로..? batch 업데이트? 알고리즘까지.. (log N -> 상수시간?)
        for (const dogWalkDayId of dogWalkDayIds) {
            const findDogWalkDay = await this.dogWalkDayRepository.findOne({ where: { id: dogWalkDayId } });
            const dogWalkDayCount = findDogWalkDay[day] as number;
            const updateCount = operation(dogWalkDayCount);

            await this.dogWalkDayRepository.update({ id: dogWalkDayId }, { [day]: updateCount });
        }
    }

    async delete(where: FindOptionsWhere<DogWalkDay>) {
        return this.dogWalkDayRepository.delete(where);
    }
}
