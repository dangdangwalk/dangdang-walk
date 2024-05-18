import { Module } from '@nestjs/common';
import { DogsModule } from 'src/dogs/dogs.module';
import { Excrements } from 'src/excrements/excrements.entity';
import { ExcrementsModule } from 'src/excrements/excrements.module';
import { JournalPhotosModule } from 'src/journal-photos/journal-photos.module';
import { DatabaseModule } from '../common/database/database.module';
import { JournalsController } from './journals.controller';
import { Journals } from './journals.entity';
import { JournalsRepository } from './journals.repository';
import { JournalsService } from './journals.service';

@Module({
    imports: [DatabaseModule.forFeature([Journals, Excrements]), DogsModule, JournalPhotosModule, ExcrementsModule],
    controllers: [JournalsController],
    providers: [JournalsService, JournalsRepository],
    exports: [JournalsService, DogsModule],
})
export class JournalsModule {}
