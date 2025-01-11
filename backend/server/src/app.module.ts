import { Module, Scope } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from 'applications/auth/auth.module';
import { Modules } from 'modules';

import { AppController } from './app.controller';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ProfilingInterceptor } from './shared/interceptors/profilingInterceptor';
import { PrometheusInterceptor } from './shared/interceptors/prometheus.interceptor';
import { StatisticsModule } from './statistics/statistics.module';
import { WalkModule } from './walk/walk.module';

@Module({
    imports: [Modules, AuthModule, StatisticsModule, WalkModule],
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
