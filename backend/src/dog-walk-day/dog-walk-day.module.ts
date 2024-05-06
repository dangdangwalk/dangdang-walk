import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { DogWalkDay } from './dog-walk-day.entity';
import { DogWalkDayRepository } from './dog-walk-day.repository';
import { DogWalkDayService } from './dog-walk-day.service';

@Module({
    imports: [DatabaseModule.forFeature([DogWalkDay])],
    exports: [DatabaseModule, DogWalkDayRepository, DogWalkDayService],
    providers: [DatabaseModule, DogWalkDayRepository, DogWalkDayService],
})
export class DogWalkDayModule {}
