import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BreedModule } from './breed/breed.module';
import { DatabaseModule } from './common/database/database.module';
import { HealthController } from './common/health/health.controller';
import { PrometheusInterceptor } from './common/interceptor/prometheus.interceptor';
import { WinstonLoggerModule } from './common/logger/winstonLogger.module';
import { DogWalkDayModule } from './dog-walk-day/dog-walk-day.module';
import { DogsModule } from './dogs/dogs.module';
import { ExcrementsModule } from './excrements/excrements.module';
import { JournalModule } from './journals/journals.module';
import { UsersModule } from './users/users.module';
import { WalkLogPhotosModule } from './walk-log-photos/walk-log-photos.module';
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
        JournalModule,
        ExcrementsModule,
        WalkLogPhotosModule,
    ],
    controllers: [AppController, HealthController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: PrometheusInterceptor,
        },
    ],
})
export class AppModule {}
