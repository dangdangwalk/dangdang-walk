import { DynamicModule, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Breed } from 'applications/breed';
import { DogWalkDay } from 'applications/dog-walk-day/dog-walk-day.entity';
import { Excrements } from 'applications/excrements/excrements.entity';
import { JournalsDogs } from 'applications/journals-dogs/journals-dogs.entity';
import { TodayWalkTime } from 'applications/today-walk-time/today-walk-time.entity';
import { UsersDogs } from 'applications/users-dogs/users-dogs.entity';
import { DataSource, FileLogger } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';

import { Dogs } from '../applications/dogs/dogs.entity';
import { Users } from '../applications/users/users.entity';
import { Journals } from '../journals/journals.entity';
import BreedSeeder from '../shared/database/breed.seeder';
import { WinstonLoggerService } from '../shared/logger/winstonLogger.service';
import { color } from '../shared/utils/ansi.util';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const nodeEnv = config.get<string>('NODE_ENV');
                const enableQueryLogger = config.get<boolean>('ENABLE_QUERY_LOGGER');

                return {
                    type: 'mysql',
                    host: config.get<string>('MYSQL_HOST'),
                    port: config.get<number>('MYSQL_PORT'),
                    username: config.get<string>('MYSQL_ROOT_USER'),
                    password: config.get<string>('MYSQL_ROOT_PASSWORD'),
                    database: config.get<string>('MYSQL_DATABASE'),
                    entities: [
                        Breed,
                        DogWalkDay,
                        Dogs,
                        Excrements,
                        Journals,
                        JournalsDogs,
                        TodayWalkTime,
                        Users,
                        UsersDogs,
                    ],
                    synchronize: true,
                    timezone: 'Z',
                    legacySpatialSupport: false,
                    ...(enableQueryLogger
                        ? { logger: new FileLogger(true, { logPath: `log/ormlogs.${nodeEnv}.log` }) }
                        : {}),
                    logging: process.env.NODE_ENV === 'local',
                };
            },
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error('옵션이 없습니다');
                }

                return getDataSourceByName('default') || addTransactionalDataSource(new DataSource(options));
            },
        }),
    ],
})
export class DatabaseModule {
    constructor(
        @Inject(getDataSourceToken()) private readonly dataSource: DataSource,
        private readonly logger: WinstonLoggerService,
    ) {}

    async onModuleInit() {
        await runSeeders(this.dataSource, { seeds: [BreedSeeder] });
        this.logger.log(color('Seed data applied successfully.', 'Yellow'));
    }

    static forFeature(models: EntityClassOrSchema[]): DynamicModule {
        return TypeOrmModule.forFeature(models);
    }
}
