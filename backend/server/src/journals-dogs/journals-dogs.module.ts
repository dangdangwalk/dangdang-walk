import { Module } from '@nestjs/common';

import { JournalsDogs } from './journals-dogs.entity';
import { JournalsDogsRepository } from './journals-dogs.repository';
import { JournalsDogsService } from './journals-dogs.service';

import { DatabaseModule } from '../common/database/database.module';

@Module({
    imports: [DatabaseModule.forFeature([JournalsDogs])],
    providers: [JournalsDogsService, JournalsDogsRepository],
    exports: [JournalsDogsService],
})
export class JournalsDogsModule {}
