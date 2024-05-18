import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { UsersDogs } from '../users-dogs/users-dogs.entity';
import { UsersDogsModule } from '../users-dogs/users-dogs.module';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
    imports: [DatabaseModule.forFeature([Users, UsersDogs]), UsersDogsModule],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersDogsModule],
})
export class UsersModule {}
