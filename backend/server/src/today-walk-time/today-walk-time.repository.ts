import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { TodayWalkTime } from './today-walk-time.entity';

import { TypeORMRepository } from '../common/database/typeorm.repository';

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
