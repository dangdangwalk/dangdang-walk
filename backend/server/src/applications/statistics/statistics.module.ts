import { Module } from '@nestjs/common';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

import { JournalsModule } from '../journals/journals.module';

@Module({
    imports: [JournalsModule],
    controllers: [StatisticsController],
    providers: [StatisticsService],
})
export class StatisticsModule {}
