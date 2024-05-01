import { Module } from '@nestjs/common';
import { DogWalkDayService } from './dog-walk-day.service';

@Module({
    providers: [DogWalkDayService],
})
export class DogWalkDayModule {}
