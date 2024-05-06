import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogWalkDay } from './dog-walk-day.entity';
import { DogWalkDayService } from './dog-walk-day.service';

@Module({
    imports: [TypeOrmModule.forFeature([DogWalkDay])],
    exports: [TypeOrmModule, DogWalkDayService],
    providers: [DogWalkDayService],
})
export class DogWalkDayModule {}
