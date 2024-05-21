import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../common/database/abstract.repository';
import { TodayWalkTime } from './today-walk-time.entity';

@Injectable()
export class TodayWalkTimeRepository extends AbstractRepository<TodayWalkTime> {
    constructor(
        @InjectRepository(TodayWalkTime)
        todayWalkTimeRepository: Repository<TodayWalkTime>,
        entityManager: EntityManager
    ) {
        super(todayWalkTimeRepository, entityManager);
    }
}
