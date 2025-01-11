import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

import { JournalsModule } from '../journals/journals.module';

@Module({
    imports: [JournalsModule, CacheModule.register()],
    controllers: [StatisticsController],
    providers: [StatisticsService],
})
export class StatisticsModule {}
