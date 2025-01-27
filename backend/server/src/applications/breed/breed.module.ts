import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database.module';

import { BreedController } from './breed.controller';
import { Breed } from './breed.entity';
import { BreedRepository } from './breed.repository';
import { BreedService } from './breed.service';

@Module({
    imports: [DatabaseModule.forFeature([Breed])],
    controllers: [BreedController],
    providers: [BreedService, BreedRepository],
    exports: [BreedService],
})
export class BreedModule {}
