import { Module } from '@nestjs/common';
import { JournalsDogsModule } from 'src/journals-dogs/journals-dogs.module';
import { S3Module } from 'src/s3/s3.module';
import { Breed } from '../breed/breed.entity';
import { BreedModule } from '../breed/breed.module';
import { DatabaseModule } from '../common/database/database.module';
import { TodayWalkTime } from '../daily-walk-time/daily-walk-time.entity';
import { DailyWalkTimeModule } from '../daily-walk-time/daily-walk-time.module';
import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';
import { DogWalkDayModule } from '../dog-walk-day/dog-walk-day.module';
import { UsersModule } from '../users/users.module';
import { DogsController } from './dogs.controller';
import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';
import { DogsService } from './dogs.service';

@Module({
    imports: [
        DatabaseModule.forFeature([Dogs, Breed, DogWalkDay, TodayWalkTime]),
        UsersModule,
        BreedModule,
        DailyWalkTimeModule,
        DogWalkDayModule,
        JournalsDogsModule,
        S3Module,
    ],
    controllers: [DogsController],
    providers: [DogsService, DogsRepository],
    exports: [DogsService, UsersModule, JournalsDogsModule, BreedModule, DailyWalkTimeModule, DogWalkDayModule],
})
export class DogsModule {}
