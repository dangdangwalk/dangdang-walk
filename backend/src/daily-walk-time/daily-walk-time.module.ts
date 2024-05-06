import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyWalkTime } from './daily-walk-time.entity';
import { DailyWalkTimeService } from './daily-walk-time.service';

@Module({
    imports: [TypeOrmModule.forFeature([DailyWalkTime])],
    exports: [TypeOrmModule, DailyWalkTimeService],
    providers: [DailyWalkTimeService],
})
export class DailyWalktimeModule {}
