import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { WinstonLoggerModule } from '../common/logger/winstonLogger.module';
import { UsersDogs } from './users-dogs.entity';
import { UsersDogsRepository } from './users-dogs.repository';
import { UsersDogsService } from './users-dogs.service';

@Module({
    imports: [DatabaseModule.forFeature([UsersDogs]), WinstonLoggerModule],
    providers: [UsersDogsService, UsersDogsRepository],
    exports: [UsersDogsService],
})
export class UsersDogsModule {}
