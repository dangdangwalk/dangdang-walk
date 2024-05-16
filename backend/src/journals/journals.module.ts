import { Module } from '@nestjs/common';
import { DogsModule } from 'src/dogs/dogs.module';
import { Excrements } from 'src/excrements/excrements.entity';
import { ExcrementsModule } from 'src/excrements/excrements.module';
import { JournalPhotosModule } from 'src/journal-photos/journal-photos.module';
import { DatabaseModule } from '../common/database/database.module';
import { JournalsDogsModule } from '../journals-dogs/journals-dogs.module';
import { JournalsController } from './journals.controller';
import { Journals } from './journals.entity';
import { JournalsRepository } from './journals.repository';
import { JournalsService } from './journals.service';

@Module({
    imports: [
        DatabaseModule.forFeature([Journals, Excrements]),
        JournalsDogsModule,
        DogsModule,
        JournalPhotosModule,
        ExcrementsModule,
    ],
    providers: [JournalsService, JournalsRepository],
    exports: [JournalsService],
    controllers: [JournalsController],
})
export class JournalsModule {}
