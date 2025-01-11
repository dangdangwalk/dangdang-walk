import { Module } from '@nestjs/common';

import { Breed, BreedModule } from 'applications/breed';

import { DogWalkDay } from 'applications/dog-walk-day/dog-walk-day.entity';

import { DogWalkDayModule } from 'applications/dog-walk-day/dog-walk-day.module';

import { DogsController } from './dogs.controller';
import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';
import { DogsService } from './dogs.service';

import { JournalsDogsModule } from '../../journals-dogs/journals-dogs.module';
import { DatabaseModule } from '../../modules/database.module';
import { TodayWalkTime } from '../../today-walk-time/today-walk-time.entity';
import { TodayWalkTimeModule } from '../../today-walk-time/today-walk-time.module';
import { UsersModule } from '../../users/users.module';

@Module({
    imports: [
        DatabaseModule.forFeature([Dogs, Breed, DogWalkDay, TodayWalkTime]),
        UsersModule,
        BreedModule,
        TodayWalkTimeModule,
        DogWalkDayModule,
        JournalsDogsModule,
    ],
    controllers: [DogsController],
    providers: [DogsService, DogsRepository],
    exports: [DogsService, UsersModule, JournalsDogsModule, BreedModule, TodayWalkTimeModule, DogWalkDayModule],
})
export class DogsModule {}
