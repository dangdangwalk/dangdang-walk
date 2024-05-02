import { Module } from '@nestjs/common';
import { ExcrementsService } from './excrements.service';

@Module({
    providers: [ExcrementsService],
})
export class ExcrementsModule {}
