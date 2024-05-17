import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../common/database/abstract.repository';
import { TodayWalkTime } from './daily-walk-time.entity';

@Injectable()
export class DailyWalkTimeRepository extends AbstractRepository<TodayWalkTime> {
    constructor(
        @InjectRepository(TodayWalkTime)
        dailyWalkTimeRepository: Repository<TodayWalkTime>,
        entityManager: EntityManager
    ) {
        super(dailyWalkTimeRepository, entityManager);
    }
}
