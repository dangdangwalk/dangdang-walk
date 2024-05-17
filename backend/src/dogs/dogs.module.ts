import { Module } from '@nestjs/common';
import { JournalsDogsModule } from 'src/journals-dogs/journals-dogs.module';
import { Breed } from '../breed/breed.entity';
import { BreedModule } from '../breed/breed.module';
import { DatabaseModule } from '../common/database/database.module';
import { WinstonLoggerModule } from '../common/logger/winstonLogger.module';
import { TodayWalkTime } from '../daily-walk-time/daily-walk-time.entity';
import { DailyWalkTimeModule } from '../daily-walk-time/daily-walk-time.module';
import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';
import { DogWalkDayModule } from '../dog-walk-day/dog-walk-day.module';
import { UsersDogsModule } from '../users-dogs/users-dogs.module';
import { UsersModule } from '../users/users.module';
import { DogsController } from './dogs.controller';
import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';
import { DogsService } from './dogs.service';

@Module({
    imports: [
        DatabaseModule.forFeature([Dogs, Breed, DogWalkDay, TodayWalkTime]),
        UsersModule,
        UsersDogsModule,
        BreedModule,
        DailyWalkTimeModule,
        WinstonLoggerModule,
        DogWalkDayModule,
        JournalsDogsModule,
    ],
    providers: [DogsRepository, DogsService],
    exports: [DogsService],
    controllers: [DogsController],
})
export class DogsModule {}
