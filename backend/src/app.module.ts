import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './common/health/health.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusInterceptor } from './common/interceptor/prometheus.interceptor';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { WinstonLoggerModule } from './common/logger/winstonLogger.module';
import { FakeModule } from './fake/fake.module';
import { DogsModule } from './dogs/dogs.module';
import { WalkModule } from './walk/walk.module';
import { BreedModule } from './breed/breed.module';
import { DogWalkDayModule } from './dog-walk-day/dog-walk-day.module';
import { JournalModule } from './journals/journals.module';
import { ExcrementsModule } from './excrements/excrements.module';
import { WalkLogPhotosModule } from './walk-log-photos/walk-log-photos.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './common/database/database.module';

@Module({
    imports: [
        FakeModule,
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
