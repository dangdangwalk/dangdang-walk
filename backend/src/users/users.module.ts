import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { WinstonLoggerModule } from '../common/logger/winstonLogger.module';
import { UsersDogs } from '../users-dogs/users-dogs.entity';
import { UsersDogsModule } from '../users-dogs/users-dogs.module';
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
