import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database.module';

import { UsersDogs } from './users-dogs.entity';
import { UsersDogsRepository } from './users-dogs.repository';
import { UsersDogsService } from './users-dogs.service';

@Module({
    imports: [DatabaseModule.forFeature([UsersDogs])],
    providers: [UsersDogsService, UsersDogsRepository],
    exports: [UsersDogsService],
})
export class UsersDogsModule {}
