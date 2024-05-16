import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { Breed } from './breed.entity';
import { BreedRepository } from './breed.repository';
import { BreedService } from './breed.service';
import { BreedController } from './breed.controller';

@Module({
    imports: [DatabaseModule.forFeature([Breed])],
    providers: [DatabaseModule, BreedRepository, BreedService],
    exports: [DatabaseModule, BreedRepository, BreedService],
    controllers: [BreedController],
})
export class BreedModule {}
