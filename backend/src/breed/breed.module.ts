import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { Breed } from './breed.entity';
import { BreedService } from './breed.service';

@Module({
    imports: [DatabaseModule.forFeature([Breed])],
    exports: [DatabaseModule, BreedService],
    providers: [BreedService],
})
export class BreedModule {}
