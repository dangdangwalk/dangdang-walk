import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { WalkJournals } from './walk-journals.entity';
import { WalkJournalsRepository } from './walk-journals.repository';

@Module({
    imports: [DatabaseModule.forFeature([WalkJournals])],
    providers: [JournalsService, WalkJournalsRepository],
    controllers: [JournalsController],
})
export class JournalModule {}
