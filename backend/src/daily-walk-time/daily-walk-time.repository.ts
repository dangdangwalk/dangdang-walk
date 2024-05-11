import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../common/database/abstract.repository';
import { DailyWalkTime } from './daily-walk-time.entity';

@Injectable()
export class DailyWalkTimeRepository extends AbstractRepository<DailyWalkTime> {
    constructor(
        @InjectRepository(DailyWalkTime)
        dailyWalkTimeRepository: Repository<DailyWalkTime>,
        entityManager: EntityManager
    ) {
        super(dailyWalkTimeRepository, entityManager);
    }
}
