import { Module } from '@nestjs/common';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { WinstonLoggerModule } from '../common/logger/winstonLogger.module';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), WinstonLoggerModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
