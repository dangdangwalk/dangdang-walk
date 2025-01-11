import { Module } from '@nestjs/common';

import { UsersDogs, UsersDogsModule } from 'applications/users-dogs';

import { UsersController } from './users.controller';

import { Users } from './users.entity';

import { UsersRepository } from './users.repository';

import { UsersService } from './users.service';

import { DatabaseModule } from '../modules/database.module';
import { S3Module } from '../s3/s3.module';

@Module({
    imports: [DatabaseModule.forFeature([Users, UsersDogs]), UsersDogsModule, S3Module],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersDogsModule, S3Module],
})
export class UsersModule {}
