import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { JournalsDogs } from './journals-dogs.entity';
import { JournalsDogsRepository } from './journals-dogs.repository';
import { JournalsDogsService } from './journals-dogs.service';

@Module({
    imports: [DatabaseModule.forFeature([JournalsDogs])],
    providers: [JournalsDogsService, JournalsDogsRepository],
    exports: [JournalsDogsService],
})
export class JournalsDogsModule {}
