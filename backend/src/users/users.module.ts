import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { Users } from './users.entity';

import { UsersRepository } from './users.repository';

import { UsersService } from './users.service';

import { DatabaseModule } from '../common/database/database.module';
import { S3Module } from '../s3/s3.module';
import { UsersDogs } from '../users-dogs/users-dogs.entity';
import { UsersDogsModule } from '../users-dogs/users-dogs.module';

@Module({
    imports: [DatabaseModule.forFeature([Users, UsersDogs]), UsersDogsModule, S3Module],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersDogsModule, S3Module],
})
export class UsersModule {}
