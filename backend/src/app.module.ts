import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './common/health/health.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusInterceptor } from './common/interceptor/prometheus.interceptor';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { WinstonLoggerModule } from './common/logger/winstonLogger.module';
import { AuthModule } from './auth/auth.module';
import { FakeModule } from './fake/fake.module';
import { DogsModule } from './dogs/dogs.module';
import { WalkModule } from './walk/walk.module';
import { BreedModule } from './breed/breed.module';
import { DogWalkDayModule } from './dog-walk-day/dog-walk-day.module';
import { JournalModule } from './journals/journals.module';
import { ExcrementsModule } from './excrements/excrements.module';
import { WalkLogPhotosModule } from './walk-log-photos/walk-log-photos.module';

@Module({
    imports: [
        FakeModule,
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
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                if (process.env.NODE_ENV === 'test') {
                    return {
                        type: 'sqlite',
                        database: config.get<string>('DB_NAME'),
                        entities: ['dist/**/*.entity{.ts,.js}'],
                        synchronize: true,
                    };
                }

                return {
                    type: 'mysql',
                    host: config.get<string>('MYSQL_HOST'),
                    port: config.get<number>('MYSQL_PORT'),
                    username: config.get<string>('MYSQL_ROOT_USER'),
                    password: config.get<string>('MYSQL_ROOT_PASSWORD'),
                    database: config.get<string>('MYSQL_DATABASE'),
                    entities: ['dist/**/*.entity{.ts,.js}'],
                    synchronize: true,
                };
            },
        }),
        UsersModule,
        ConfigModule,
        AuthModule,
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
