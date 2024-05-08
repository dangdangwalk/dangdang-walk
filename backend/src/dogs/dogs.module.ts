import { Module } from '@nestjs/common';
import { Breed } from 'src/breed/breed.entity';
import { BreedModule } from 'src/breed/breed.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { WinstonLoggerModule } from 'src/common/logger/winstonLogger.module';
import { DailyWalkTime } from 'src/daily-walk-time/daily-walk-time.entity';
import { DailyWalkTimeModule } from 'src/daily-walk-time/daily-walk-time.module';
import { DogWalkDay } from 'src/dog-walk-day/dog-walk-day.entity';
import { DogWalkDayModule } from 'src/dog-walk-day/dog-walk-day.module';
import { UsersDogsModule } from 'src/users-dogs/users-dogs.module';
import { UsersModule } from 'src/users/users.module';
import { DogsController } from './dogs.controller';
import { Dogs } from './dogs.entity';
import { DogsRepository } from './dogs.repository';
import { DogsService } from './dogs.service';

@Module({
    imports: [
        DatabaseModule.forFeature([Dogs, Breed, DogWalkDay, DailyWalkTime]),
        UsersModule,
        UsersDogsModule,
        BreedModule,
        DailyWalkTimeModule,
        WinstonLoggerModule,
        DogWalkDayModule,
    ],
    providers: [DogsRepository, DogsService],
    exports: [DogsService],
    controllers: [DogsController],
})
export class DogsModule {}
