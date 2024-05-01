import { Module } from '@nestjs/common';
import { DogWalkDayService } from './dog-walk-day.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogWalkDay } from './dog-walk-day.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DogWalkDay])],
    exports: [TypeOrmModule, DogWalkDayService],
    providers: [DogWalkDayService],
})
export class DogWalkDayModule {}
