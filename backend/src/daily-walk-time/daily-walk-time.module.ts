import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { TodayWalkTime } from './daily-walk-time.entity';
import { DailyWalkTimeRepository } from './daily-walk-time.repository';
import { DailyWalkTimeService } from './daily-walk-time.service';

@Module({
    imports: [DatabaseModule.forFeature([TodayWalkTime])],
    providers: [DailyWalkTimeService, DailyWalkTimeRepository],
    exports: [DailyWalkTimeService],
})
export class DailyWalkTimeModule {}
