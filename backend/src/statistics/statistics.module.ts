import { Module } from '@nestjs/common';
import { DogsModule } from 'src/dogs/dogs.module';
import { JournalsModule } from 'src/journals/journals.module';
import { BreedModule } from '../breed/breed.module';
import { WinstonLoggerModule } from '../common/logger/winstonLogger.module';
import { DailyWalkTimeModule } from '../daily-walk-time/daily-walk-time.module';
import { DogWalkDayModule } from '../dog-walk-day/dog-walk-day.module';
import { UsersModule } from '../users/users.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
    imports: [
        UsersModule,
        DogsModule,
        BreedModule,
        DailyWalkTimeModule,
        DogWalkDayModule,
        JournalsModule,
        WinstonLoggerModule,
    ],
    providers: [StatisticsService],
    controllers: [StatisticsController],
})
export class StatisticsModule {}
