import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database.module';

import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { ExcrementsService } from './excrements.service';

@Module({
    imports: [DatabaseModule.forFeature([Excrements])],
    providers: [ExcrementsService, ExcrementsRepository],
    exports: [ExcrementsService],
})
export class ExcrementsModule {}
