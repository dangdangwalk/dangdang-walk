import { Module } from '@nestjs/common';

import { TodayWalkTime } from './today-walk-time.entity';
import { TodayWalkTimeRepository } from './today-walk-time.repository';
import { TodayWalkTimeService } from './today-walk-time.service';

import { DatabaseModule } from '../common/database/database.module';

@Module({
    imports: [DatabaseModule.forFeature([TodayWalkTime])],
    providers: [TodayWalkTimeService, TodayWalkTimeRepository],
    exports: [TodayWalkTimeService],
})
export class TodayWalkTimeModule {}
