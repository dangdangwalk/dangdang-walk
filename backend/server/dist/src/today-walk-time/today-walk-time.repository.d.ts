import { EntityManager, Repository } from 'typeorm';
import { TodayWalkTime } from './today-walk-time.entity';
import { AbstractRepository } from '../common/database/abstract.repository';
export declare class TodayWalkTimeRepository extends AbstractRepository<TodayWalkTime> {
    constructor(todayWalkTimeRepository: Repository<TodayWalkTime>, entityManager: EntityManager);
}
