import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { EntityManager, Repository } from 'typeorm';
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
