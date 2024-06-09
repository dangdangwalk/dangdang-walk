import { Module } from '@nestjs/common';

import { DatabaseModule } from '../common/database/database.module';

import { TodayWalkTime } from './today-walk-time.entity';
import { TodayWalkTimeRepository } from './today-walk-time.repository';
import { TodayWalkTimeService } from './today-walk-time.service';

@Module({
    imports: [DatabaseModule.forFeature([TodayWalkTime])],
    providers: [TodayWalkTimeService, TodayWalkTimeRepository],
    exports: [TodayWalkTimeService],
})
export class TodayWalkTimeModule {}
