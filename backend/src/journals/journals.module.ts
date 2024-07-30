import { Module } from '@nestjs/common';

import { JournalsController } from './journals.controller';

import { Journals } from './journals.entity';

import { JournalsRepository } from './journals.repository';

import { JournalsService } from './journals.service';

import { DatabaseModule } from '../common/database/database.module';
import { DogsModule } from '../dogs/dogs.module';
import { Excrements } from '../excrements/excrements.entity';
import { ExcrementsModule } from '../excrements/excrements.module';

@Module({
    imports: [DatabaseModule.forFeature([Journals, Excrements]), DogsModule, ExcrementsModule],
    controllers: [JournalsController],
    providers: [JournalsService, JournalsRepository],
    exports: [JournalsService, DogsModule],
})
export class JournalsModule {}
