import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BreedModule } from './breed/breed.module';
import { DatabaseModule } from './common/database/database.module';
import { HealthController } from './common/health/health.controller';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrometheusInterceptor } from './common/interceptors/prometheus.interceptor';
import { WinstonLoggerModule } from './common/logger/winstonLogger.module';
import { DogWalkDayModule } from './dog-walk-day/dog-walk-day.module';
import { DogsModule } from './dogs/dogs.module';
import { ExcrementsModule } from './excrements/excrements.module';
import { JournalPhotosModule } from './journal-photos/journal-photos.module';
import { JournalsDogsModule } from './journals-dogs/journals-dogs.module';
import { JournalsModule } from './journals/journals.module';
import { S3Module } from './s3/s3.module';
import { StatisticsModule } from './statistics/statistics.module';
import { UsersModule } from './users/users.module';
import { WalkModule } from './walk/walk.module';

@Module({
    imports: [
        DatabaseModule,
        WinstonLoggerModule,
        PrometheusModule.register({
            path: '/metrics',
            defaultMetrics: {
                enabled: true,
            },
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        AuthModule,
        UsersModule,
        ConfigModule,
        DogsModule,
        WalkModule,
        BreedModule,
        DogWalkDayModule,
        JournalsModule,
        ExcrementsModule,
        JournalPhotosModule,
        JournalsDogsModule,
        S3Module,
        StatisticsModule,
    ],
    controllers: [AppController, HealthController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: PrometheusInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            scope: Scope.REQUEST,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
