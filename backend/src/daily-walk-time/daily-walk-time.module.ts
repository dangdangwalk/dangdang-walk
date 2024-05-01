import { Module } from '@nestjs/common';
import { DailyWalkTimeService } from './daily-walk-time.service';
import { DailyWalkTime } from './daily-walk-time.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([DailyWalkTime])],
    exports: [TypeOrmModule, DailyWalkTimeService],
    providers: [DailyWalkTimeService],
})
export class DailyWalktimeModule {}
