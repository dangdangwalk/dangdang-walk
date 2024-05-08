import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { DogWalkDay } from './dog-walk-day.entity';
import { DogWalkDayRepository } from './dog-walk-day.repository';

@Injectable()
export class DogWalkDayService {
    constructor(private readonly dogWalkDayRepository: DogWalkDayRepository) {}

    async find(where: FindOptionsWhere<DogWalkDay>): Promise<DogWalkDay[]> {
        return this.dogWalkDayRepository.find(where);
    }

    async delete(where: FindOptionsWhere<DogWalkDay>) {
        return this.dogWalkDayRepository.delete(where);
    }

    private getValuesOnly(walkDays: any[]) {
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
        const foundDays = await this.dogWalkDayRepository.find({ id: In(walkDayIds) });
        if (!foundDays.length) {
            throw new NotFoundException();
        }
        return this.getValuesOnly(foundDays);
    }
}
