import { DynamicModule, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource, FileLogger } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';

import BreedSeeder from './seeds/breed.seeder';

import { Breed } from '../../breed/breed.entity';
import { DogWalkDay } from '../../dog-walk-day/dog-walk-day.entity';
import { Dogs } from '../../dogs/dogs.entity';
import { Excrements } from '../../excrements/excrements.entity';
import { Journals } from '../../journals/journals.entity';
import { JournalsDogs } from '../../journals-dogs/journals-dogs.entity';
import { TodayWalkTime } from '../../today-walk-time/today-walk-time.entity';
import { Users } from '../../users/users.entity';
import { UsersDogs } from '../../users-dogs/users-dogs.entity';
import { color } from '../../utils/ansi.util';
import { WinstonLoggerService } from '../logger/winstonLogger.service';

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
