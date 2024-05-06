import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breed } from './breed.entity';
import { BreedService } from './breed.service';

@Module({
    imports: [TypeOrmModule.forFeature([Breed])],
    exports: [TypeOrmModule, BreedService],
    providers: [BreedService],
})
export class BreedModule {}
