import { Module } from '@nestjs/common';
import { Users } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { WinstonLoggerModule } from '../common/logger/winstonLogger.module';
import { UsersService } from './users.service';
import { UsersDogs } from 'src/users/userDogs.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Users, UsersDogs]), WinstonLoggerModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
