import { Module } from '@nestjs/common';

import { JournalPhotos } from './journal-photos.entity';
import { JournalPhotosRepository } from './journal-photos.repository';
import { JournalPhotosService } from './journal-photos.service';

import { DatabaseModule } from '../common/database/database.module';

@Module({
    imports: [DatabaseModule.forFeature([JournalPhotos])],
    providers: [JournalPhotosService, JournalPhotosRepository],
    exports: [JournalPhotosService],
})
export class JournalPhotosModule {}
