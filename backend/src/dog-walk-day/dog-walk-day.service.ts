import { Injectable, NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { getLastSunday } from 'src/utils/date.util';
import { FindManyOptions, FindOptionsWhere, In, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DogWalkDay } from './dog-walk-day.entity';
import { DogWalkDayRepository } from './dog-walk-day.repository';

@Injectable()
export class DogWalkDayService {
    constructor(
        private readonly dogWalkDayRepository: DogWalkDayRepository,
        private readonly logger: WinstonLoggerService
    ) {}

    async find(where: FindManyOptions<DogWalkDay>): Promise<DogWalkDay[]> {
        return this.dogWalkDayRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<DogWalkDay>): Promise<DogWalkDay> {
        return this.dogWalkDayRepository.findOne(where);
    }

    async delete(where: FindOptionsWhere<DogWalkDay>) {
        return this.dogWalkDayRepository.delete(where);
    }

    async update(
        where: FindOptionsWhere<DogWalkDay>,
        partialEntity: QueryDeepPartialEntity<DogWalkDay>
    ): Promise<UpdateResult> {
        return this.dogWalkDayRepository.update(where, partialEntity);
    }

    private getDayCntOnly(walkDay: DogWalkDay): number[] {
        const dayCntArr = [];
        for (const key in walkDay) {
            if (key !== 'id' && key !== 'updatedAt') {
                dayCntArr.push(walkDay[key] as number);
            }
        }
        return dayCntArr;
    }

    async checkWeekPassed(updatedAt: Date, walkDayId: number) {
        const lastSunday = getLastSunday();
        if (updatedAt < lastSunday) {
            await this.update({ id: walkDayId }, { mon: 0, tue: 0, wed: 0, thr: 0, fri: 0, sat: 0, sun: 0 });
        }
    }

    async updateValues(dogWalkDayIds: number[], operation: (current: number) => number) {
        const dayArr = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
        const day = dayArr[new Date().getDay()];

        for (const curWalkDayId of dogWalkDayIds) {
            const curWalkDay = await this.findOne({ id: curWalkDayId });
            const curCnt = curWalkDay[day] as number;
            const updateCnt = operation(curCnt);
            this.update({ id: curWalkDayId }, { [day]: updateCnt });
        }
    }

    async getWalkDayList(walkDayIds: number[]): Promise<number[][]> {
        const foundDays = await this.dogWalkDayRepository.find({ where: { id: In(walkDayIds) } });
        if (!foundDays.length) {
            this.logger.error('Related table not exists : DogWalkDay ', '');
            throw new NotFoundException('Related table not exists : DogWalkDay ');
        }

        const result: number[][] = [];
        for (const curDays of foundDays) {
            await this.checkWeekPassed(curDays.updatedAt, curDays.id);
            result.push(this.getDayCntOnly(curDays));
        }
        return result;
    }
}
