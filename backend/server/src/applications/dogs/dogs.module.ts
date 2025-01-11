import { Module } from '@nestjs/common';

import { Breed, BreedModule } from 'applications/breed';

import { DogWalkDay } from 'applications/dog-walk-day/dog-walk-day.entity';

import { DogWalkDayModule } from 'applications/dog-walk-day/dog-walk-day.module';

import { JournalsDogsModule } from 'applications/journals-dogs/journals-dogs.module';
import { TodayWalkTime, TodayWalkTimeModule } from 'applications/today-walk-time';

import { DogsController } from './dogs.controller';
import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';
import { DogsService } from './dogs.service';

import { DatabaseModule } from '../../modules/database.module';
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
