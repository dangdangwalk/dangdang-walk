import { Module } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dogs } from './dogs.entity';
import { DogsController } from './dogs.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Dogs]), UsersModule],
    providers: [DogsService, UsersService],
    exports: [TypeOrmModule, DogsService],
    controllers: [DogsController],
})
export class DogsModule {}
