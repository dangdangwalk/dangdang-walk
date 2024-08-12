import { EntityManager, FindOptionsWhere } from 'typeorm';
import { DogWalkDay } from './dog-walk-day.entity';
import { DogWalkDayRepository } from './dog-walk-day.repository';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { UpdateDogWalkDayOperation } from '../journals/types/journal.types';
export declare class DogWalkDayService {
    private readonly dogWalkDayRepository;
    private readonly entityManager;
    private readonly logger;
    constructor(dogWalkDayRepository: DogWalkDayRepository, entityManager: EntityManager, logger: WinstonLoggerService);
    updateIfStaleAndGetWeeklyWalks(dogWalkDay: DogWalkDay): Promise<number[]>;
    updateDailyWalkCount(dogWalkDayIds: number[], operation: UpdateDogWalkDayOperation): Promise<void>;
    delete(where: FindOptionsWhere<DogWalkDay>): Promise<import('typeorm').DeleteResult>;
}
