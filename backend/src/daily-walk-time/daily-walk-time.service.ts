import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyWalkTime } from './daily-walk-time.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class DailyWalkTimeService {
    constructor(@InjectRepository(DailyWalkTime) private readonly dailyWalkTimeRepo: Repository<DailyWalkTime>) {}

    async getWalkTimeList(walkTimeIds: number[]) {
        const walkTimeList = await this.dailyWalkTimeRepo.find({ where: { id: In(walkTimeIds) } });
        return walkTimeList.map((cur) => {
            return cur.duration;
        });
    }
}
