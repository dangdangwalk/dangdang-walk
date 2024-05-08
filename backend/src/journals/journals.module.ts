import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { Journals } from './journals.entity';
import { WalkJournalsRepository } from './journals.repository';
import { JournalsService } from './journals.service';

@Module({
    imports: [DatabaseModule.forFeature([Journals])],
    providers: [JournalsService, WalkJournalsRepository],
})
export class JournalModule {}
