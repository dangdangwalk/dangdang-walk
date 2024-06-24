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
        if (!walkDayIds.length) {
            this.logger.error(`walkDayIds에 값이 없습니다`, '');
            throw new NotFoundException(`walkDayIds에 값이 없습니다`);
        }

        const foundDays = await this.dogWalkDayRepository.find({ where: { id: In(walkDayIds) } });

        if (!foundDays.length) {
            this.logger.error(`id가 ${walkDayIds}인 레코드를 찾을 수 없습니다`, '');
            throw new NotFoundException(`id가 ${walkDayIds}인 레코드를 찾을 수 없습니다`);
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

    private getDayCountOnly(walkDay: DogWalkDay): number[] {
        const dayCountArray = [];
        for (const key in walkDay) {
            if (key !== 'id' && key !== 'updatedAt') {
                dayCountArray.push(walkDay[key] as number);
            }
        }

        return dayCountArray;
    }

    //TODO: 비즈니스 로직으로 reset 연산 처리 하기
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
