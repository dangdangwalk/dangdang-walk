import { Module } from '@nestjs/common';

import { UsersDogs } from './users-dogs.entity';
import { UsersDogsRepository } from './users-dogs.repository';
import { UsersDogsService } from './users-dogs.service';

import { DatabaseModule } from '../common/database/database.module';

@Module({
    imports: [DatabaseModule.forFeature([UsersDogs])],
    providers: [UsersDogsService, UsersDogsRepository],
    exports: [UsersDogsService],
})
export class UsersDogsModule {}
