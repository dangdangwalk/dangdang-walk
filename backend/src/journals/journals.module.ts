import { Module } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { WalkJournalsRepository } from './walk-jorunals.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { WalkJournals } from './walk-journals.entity';

@Module({
    imports: [DatabaseModule.forFeature([WalkJournals])],
    providers: [JournalsService, WalkJournalsRepository],
    controllers: [JournalsController],
})
export class JournalModule {}
