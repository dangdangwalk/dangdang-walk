import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { UsersDogs } from 'src/users-dogs/users-dogs.entity';
import { UsersDogsModule } from 'src/users-dogs/users-dogs.module';
import { WinstonLoggerModule } from '../common/logger/winstonLogger.module';
import { UsersController } from './users.controller';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
    imports: [DatabaseModule.forFeature([Users, UsersDogs]), UsersDogsModule, WinstonLoggerModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
