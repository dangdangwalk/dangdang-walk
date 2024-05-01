import { Module } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dogs } from './dogs.entity';
import { DogsController } from './dogs.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { BreedService } from 'src/breed/breed.service';
import { BreedModule } from 'src/breed/breed.module';
import { Breed } from 'src/breed/breed.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Dogs, Breed]), UsersModule, BreedModule],
    providers: [DogsService, UsersService, BreedService],
    exports: [TypeOrmModule, DogsService],
    controllers: [DogsController],
})
export class DogsModule {}
