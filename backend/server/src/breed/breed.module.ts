import { Module } from '@nestjs/common';

import { BreedController } from './breed.controller';
import { Breed } from './breed.entity';
import { BreedRepository } from './breed.repository';
import { BreedService } from './breed.service';

import { DatabaseModule } from '../common/database/database.module';

@Module({
    imports: [DatabaseModule.forFeature([Breed])],
    controllers: [BreedController],
    providers: [BreedService, BreedRepository],
    exports: [BreedService],
})
export class BreedModule {}
