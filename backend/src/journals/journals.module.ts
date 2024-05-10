import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { ExcrementsModule } from '../excrements/excrements.module';
import { JournalsController } from './journals.controller';
import { Journals } from './journals.entity';
import { WalkJournalsRepository } from './journals.repository';
import { JournalsService } from './journals.service';

@Module({
    imports: [DatabaseModule.forFeature([Journals]), ExcrementsModule],
    providers: [JournalsService, WalkJournalsRepository],
    controllers: [JournalsController],
})
export class JournalModule {}
