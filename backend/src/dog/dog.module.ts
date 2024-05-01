import { Module } from '@nestjs/common';
import { DogService } from './dog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dogs } from './dogs.entity';
import { BreedModule } from 'src/breed/breed.module';
import { BreedService } from 'src/breed/breed.service';

@Module({
    imports: [TypeOrmModule.forFeature([Dogs]), BreedModule],
    providers: [DogService, BreedService],
    exports: [TypeOrmModule, DogService],
})
export class DogModule {}
