import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { Breed } from './breed.entity';
import { BreedRepository } from './breed.repository';
import { BreedService } from './breed.service';

@Module({
    imports: [DatabaseModule.forFeature([Breed])],
    providers: [DatabaseModule, BreedRepository, BreedService],
    exports: [DatabaseModule, BreedRepository, BreedService],
})
export class BreedModule {}
