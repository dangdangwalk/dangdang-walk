import { Module } from '@nestjs/common';

import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { ExcrementsService } from './excrements.service';

import { DatabaseModule } from '../common/database/database.module';

@Module({
    imports: [DatabaseModule.forFeature([Excrements])],
    providers: [ExcrementsService, ExcrementsRepository],
    exports: [ExcrementsService],
})
export class ExcrementsModule {}
