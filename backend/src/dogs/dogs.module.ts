import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breed } from 'src/breed/breed.entity';
import { BreedModule } from 'src/breed/breed.module';
import { BreedService } from 'src/breed/breed.service';
import { WinstonLoggerModule } from 'src/common/logger/winstonLogger.module';
import { DailyWalkTime } from 'src/daily-walk-time/daily-walk-time.entity';
import { DailyWalktimeModule } from 'src/daily-walk-time/daily-walk-time.module';
import { DailyWalkTimeService } from 'src/daily-walk-time/daily-walk-time.service';
import { DogWalkDay } from 'src/dog-walk-day/dog-walk-day.entity';
import { DogWalkDayService } from 'src/dog-walk-day/dog-walk-day.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { DogsController } from './dogs.controller';
import { Dogs } from './dogs.entity';
import { DogsService } from './dogs.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Dogs, Breed, DogWalkDay, DailyWalkTime]),
        UsersModule,
        BreedModule,
        DailyWalktimeModule,
        WinstonLoggerModule,
    ],
    providers: [DogsService, UsersService, BreedService, DogWalkDayService, DailyWalkTimeService],
    exports: [TypeOrmModule, DogsService],
    controllers: [DogsController],
})
export class DogsModule {}
