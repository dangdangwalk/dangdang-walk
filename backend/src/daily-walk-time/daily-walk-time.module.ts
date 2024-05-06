import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { DailyWalkTime } from './daily-walk-time.entity';
import { DailyWalkTimeRepository } from './daily-walk-time.repository';
import { DailyWalkTimeService } from './daily-walk-time.service';

@Module({
    imports: [DatabaseModule.forFeature([DailyWalkTime])],
    providers: [DatabaseModule, DailyWalkTimeRepository, DailyWalkTimeService],
    exports: [DatabaseModule, DailyWalkTimeRepository, DailyWalkTimeService],
})
export class DailyWalkTimeModule {}
