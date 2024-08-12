import { EntityManager, Repository } from 'typeorm';
import { DogWalkDay } from './dog-walk-day.entity';
import { AbstractRepository } from '../common/database/abstract.repository';
export declare class DogWalkDayRepository extends AbstractRepository<DogWalkDay> {
    constructor(dogWalkDayRepository: Repository<DogWalkDay>, entityManager: EntityManager);
}
