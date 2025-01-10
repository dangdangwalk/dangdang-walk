import { CacheModule } from '@nestjs/cache-manager';
import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ProfilingInterceptor } from './common/interceptors/profilingInterceptor';
import { PrometheusInterceptor } from './common/interceptors/prometheus.interceptor';
import { DatabaseModule } from './modules/database.module';
import { HealthModule } from './modules/health.module';
import { StatisticsModule } from './statistics/statistics.module';
import { WalkModule } from './walk/walk.module';

@Module({
    imports: [
        DatabaseModule,
        CacheModule.register(),
        EventEmitterModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        PrometheusModule.register({
            path: '/metrics',
            defaultMetrics: {
                enabled: true,
            },
        }),
        AuthModule,
        StatisticsModule,
        WalkModule,
        HealthModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: PrometheusInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            scope: Scope.REQUEST,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        ...(process.env.ENABLE_PROFILING === 'true'
            ? [
                  {
                      provide: APP_INTERCEPTOR,
                      useClass: ProfilingInterceptor,
                  },
              ]
            : []),
    ],
})
export class AppModule {}
