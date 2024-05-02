import { Module } from '@nestjs/common';
import { BreedService } from './breed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breed } from './breed.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Breed])],
    exports: [TypeOrmModule, BreedService],
    providers: [BreedService],
})
export class BreedModule {}
