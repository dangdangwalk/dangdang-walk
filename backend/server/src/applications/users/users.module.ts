import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { Users } from './users.entity';

import { UsersRepository } from './users.repository';

import { UsersService } from './users.service';

import { S3Module } from '../../infrastructure/aws/s3/s3.module';
import { DatabaseModule } from '../../modules/database.module';
import { UsersDogs, UsersDogsModule } from '../users-dogs';

@Module({
    imports: [DatabaseModule.forFeature([Users, UsersDogs]), UsersDogsModule, S3Module],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersDogsModule, S3Module],
})
export class UsersModule {}
