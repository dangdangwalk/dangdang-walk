import { DynamicModule, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource, FileLogger } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';

import BreedSeeder from './seeds/breed.seeder';

import { color } from '../../utils/ansi.util';
import { WinstonLoggerService } from '../logger/winstonLogger.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService, WinstonLoggerService],
            useFactory: (config: ConfigService) => {
                const nodeEnv = config.get<string>('NODE_ENV');
                const isTest = nodeEnv === 'test';
                const isLocal = nodeEnv === 'local';

                return {
                    type: 'mysql',
                    host: config.get<string>('MYSQL_HOST'),
                    port: config.get<number>('MYSQL_PORT'),
                    username: config.get<string>('MYSQL_ROOT_USER'),
                    password: config.get<string>('MYSQL_ROOT_PASSWORD'),
                    database: config.get<string>('MYSQL_DATABASE'),
                    entities: isTest ? ['src/**/*.entity{.ts,.js}'] : ['dist/**/*.entity{.ts,.js}'],
                    synchronize: true,
                    timezone: 'Z',
                    legacySpatialSupport: false,
                    ...(isTest || isLocal
                        ? { logger: new FileLogger(true, { logPath: `log/ormlogs.${nodeEnv}.log` }) }
                        : {}),
                };
            },
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error('Invalid options passed');
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
