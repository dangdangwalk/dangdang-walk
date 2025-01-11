import { Module } from '@nestjs/common';

import { ExcrementsModule } from 'applications/excrements';
import { Excrements } from 'applications/excrements/excrements.entity';

import { JournalsController } from './journals.controller';

import { Journals } from './journals.entity';

import { JournalsRepository } from './journals.repository';

import { JournalsService } from './journals.service';

import { DogsModule } from '../applications/dogs/dogs.module';
import { DatabaseModule } from '../modules/database.module';

@Module({
    imports: [DatabaseModule.forFeature([Journals, Excrements]), DogsModule, ExcrementsModule],
    controllers: [JournalsController],
    providers: [JournalsService, JournalsRepository],
    exports: [JournalsService, DogsModule],
})
export class JournalsModule {}
