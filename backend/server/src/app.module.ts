import { Module, Scope } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Modules } from 'modules';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ProfilingInterceptor } from './common/interceptors/profilingInterceptor';
import { PrometheusInterceptor } from './common/interceptors/prometheus.interceptor';
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
