import { Module } from '@nestjs/common';
import { JournalsModule } from '../journals/journals.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
    imports: [JournalsModule],
    controllers: [StatisticsController],
    providers: [StatisticsService],
})
export class StatisticsModule {}
