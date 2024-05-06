import { Module } from '@nestjs/common';
import { Breed } from 'src/breed/breed.entity';
import { BreedModule } from 'src/breed/breed.module';
import { BreedService } from 'src/breed/breed.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { WinstonLoggerModule } from 'src/common/logger/winstonLogger.module';
import { DailyWalkTime } from 'src/daily-walk-time/daily-walk-time.entity';
import { DailyWalkTimeModule } from 'src/daily-walk-time/daily-walk-time.module';
import { DailyWalkTimeService } from 'src/daily-walk-time/daily-walk-time.service';
import { DogWalkDay } from 'src/dog-walk-day/dog-walk-day.entity';
import { DogWalkDayModule } from 'src/dog-walk-day/dog-walk-day.module';
import { DogWalkDayService } from 'src/dog-walk-day/dog-walk-day.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { DogsController } from './dogs.controller';
import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';
import { DogsService } from './dogs.service';

@Module({
    imports: [
        DatabaseModule.forFeature([Dogs, Breed, DogWalkDay, DailyWalkTime]),
        UsersModule,
        BreedModule,
        DailyWalkTimeModule,
        WinstonLoggerModule,
        DogWalkDayModule,
    ],
    providers: [
        DatabaseModule,
        DogsRepository,
        DogsService,
        UsersService,
        BreedService,
        DogWalkDayService,
        DailyWalkTimeService,
    ],
    exports: [DatabaseModule, DogsRepository, DogsService],
    controllers: [DogsController],
})
export class DogsModule {}
