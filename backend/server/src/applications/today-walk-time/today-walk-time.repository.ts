import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeORMRepository } from 'shared/database/typeorm.repository';
import { EntityManager, Repository } from 'typeorm';

import { TodayWalkTime } from './today-walk-time.entity';

@Injectable()
export class TodayWalkTimeRepository extends TypeORMRepository<TodayWalkTime> {
    constructor(
        @InjectRepository(TodayWalkTime)
        todayWalkTimeRepository: Repository<TodayWalkTime>,
        entityManager: EntityManager,
    ) {
        super(todayWalkTimeRepository, entityManager);
    }
}
