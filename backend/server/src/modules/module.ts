import { Module } from '@nestjs/common';

import { CacheModule } from './cache.module';
import { ConfigModule } from './config.module';
import { DatabaseModule } from './database.module';
import { EventemitterModule } from './eventemitter.module';
import { HealthModule } from './health.module';
import { LoggerModule } from './logger.module';
import { PrometheusModule } from './prometheus.module';

@Module({
    imports: [
        CacheModule,
        LoggerModule,
        PrometheusModule,
        HealthModule,
        EventemitterModule,
        DatabaseModule,
        ConfigModule,
    ],
})
export class Modules {}
