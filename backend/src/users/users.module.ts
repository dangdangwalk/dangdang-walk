import { Module } from '@nestjs/common';
//import { User } from './users.entity';
//import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { WinstonLoggerModule } from '../common/logger/winstonLogger.module';

@Module({
  imports: [/*TypeOrmModule.forFeature([User]),*/ WinstonLoggerModule],
  controllers: [UsersController],
})
export class UsersModule {}
