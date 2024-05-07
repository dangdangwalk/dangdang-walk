import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { JournalPhotosController } from './journal-photos.controller';
import { JournalPhotos } from './journal-photos.entity';
import { JournalPhotosRepository } from './journal-photos.repository';
import { JournalPhotosService } from './journal-photos.service';

@Module({
    imports: [DatabaseModule.forFeature([JournalPhotos])],
    providers: [JournalPhotosRepository, JournalPhotosService],
    exports: [JournalPhotosService],
    controllers: [JournalPhotosController],
})
export class JournalPhotosModule {}
