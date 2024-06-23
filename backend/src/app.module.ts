import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './common/database/database.module';
import { HealthController } from './common/health/health.controller';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ProfilingInterceptor } from './common/interceptors/profilingInterceptor';
import { PrometheusInterceptor } from './common/interceptors/prometheus.interceptor';
import { WinstonLoggerModule } from './common/logger/winstonLogger.module';
import { StatisticsModule } from './statistics/statistics.module';
import { WalkModule } from './walk/walk.module';

@Module({
    imports: [
        DatabaseModule,
        WinstonLoggerModule,
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
    ],
    controllers: [AppController, HealthController],
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
