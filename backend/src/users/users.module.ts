import { Module } from '@nestjs/common';
import { S3Module } from 'src/s3/s3.module';
import { DatabaseModule } from '../common/database/database.module';
import { UsersDogs } from '../users-dogs/users-dogs.entity';
import { UsersDogsModule } from '../users-dogs/users-dogs.module';
import { UsersController } from './users.controller';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
    imports: [DatabaseModule.forFeature([Users, UsersDogs]), UsersDogsModule, S3Module],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersDogsModule, S3Module],
})
export class UsersModule {}
