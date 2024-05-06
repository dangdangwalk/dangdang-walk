import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { DailyWalkTimeRepository } from './daily-walk-time.repository';

@Injectable()
export class DailyWalkTimeService {
    constructor(private readonly dailyWalkTimeRepository: DailyWalkTimeRepository) {}

    async getWalkTimeList(walkTimeIds: number[]) {
        const walkTimeList = await this.dailyWalkTimeRepository.find({ id: In(walkTimeIds) });
        return walkTimeList.map((cur) => {
            return cur.duration;
        });
    }
}
