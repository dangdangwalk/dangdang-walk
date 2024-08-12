import { EntityManager, FindOptionsWhere } from 'typeorm';
import { TodayWalkTime } from './today-walk-time.entity';
import { TodayWalkTimeRepository } from './today-walk-time.repository';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { UpdateTodayWalkTimeOperation } from '../journals/types/journal.types';
export declare class TodayWalkTimeService {
    private readonly todayWalkTimeRepository;
    private readonly logger;
    private readonly entityManager;
    constructor(
        todayWalkTimeRepository: TodayWalkTimeRepository,
        logger: WinstonLoggerService,
        entityManager: EntityManager,
    );
    delete(where: FindOptionsWhere<TodayWalkTime>): Promise<import('typeorm').DeleteResult>;
    updateIfStaleAndGetDuration(todayWalkTime: TodayWalkTime): Promise<number>;
    updateDurations(walkTimeIds: number[], duration: number, operation: UpdateTodayWalkTimeOperation): Promise<void>;
    private findWalkTimesByIds;
}
