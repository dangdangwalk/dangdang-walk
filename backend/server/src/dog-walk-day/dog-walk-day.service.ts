import { Injectable } from '@nestjs/common';

import { EntityManager, FindOptionsWhere, In } from 'typeorm';

import { DogWalkDay } from './dog-walk-day.entity';

import { DogWalkDayRepository } from './dog-walk-day.repository';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { UpdateDogWalkDayOperation } from '../journals/types/journal.types';
import { getLastSunday } from '../utils/date.util';
import { makeSubObject } from '../utils/manipulate.util';

@Injectable()
export class DogWalkDayService {
    constructor(
        private readonly dogWalkDayRepository: DogWalkDayRepository,
        private readonly entityManager: EntityManager,
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

    async updateDailyWalkCount(dogWalkDayIds: number[], operation: UpdateDogWalkDayOperation): Promise<void> {
        const weekDay = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
        const today = new Date().getDay();
        const day = weekDay[today];

        const findDogWalkDays = await this.dogWalkDayRepository.find({ where: { id: In(dogWalkDayIds) } });
        const updateEntities: Partial<DogWalkDay>[] = findDogWalkDays.map((curDogWalkDay) => {
            const dogWalkDayCount = curDogWalkDay[day] as number;
            return new DogWalkDay({ id: curDogWalkDay.id, [day]: operation(dogWalkDayCount) });
        });

        await this.entityManager
            .createQueryBuilder(DogWalkDay, 'dogWalkDay')
            .insert()
            .into(DogWalkDay, ['id', day])
            .values(updateEntities)
            .orUpdate([day], ['id'])
            .execute();
    }

    async delete(where: FindOptionsWhere<DogWalkDay>) {
        return await this.dogWalkDayRepository.delete(where);
    }
}
