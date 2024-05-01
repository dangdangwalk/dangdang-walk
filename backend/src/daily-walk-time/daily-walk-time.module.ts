import { Module } from '@nestjs/common';
import { DailyWalkTimeService } from './daily-walk-time.service';

@Module({
    providers: [DailyWalkTimeService],
})
export class DailyWalktimeModule {}
