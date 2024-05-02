import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DogWalkDay } from './dog-walk-day.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class DogWalkDayService {
    constructor(@InjectRepository(DogWalkDay) private dogWalkDayRepo: Repository<DogWalkDay>) {}

    getValuesOnly(walkDays: any[]) {
        const daysValues = walkDays.map((curWeek) => {
            const valueArr = [];
            for (const key in curWeek) {
                if (key !== 'id') {
                    valueArr.push(curWeek[key]);
                }
            }
            return valueArr;
        });
        return daysValues;
    }

    async getWalkDayList(walkDayIds: number[]): Promise<number[][]> {
        const foundDays = await this.dogWalkDayRepo.find({ where: { id: In(walkDayIds) } });
        if (!foundDays) {
            throw new NotFoundException();
        }

        return this.getValuesOnly(foundDays);
    }
}
