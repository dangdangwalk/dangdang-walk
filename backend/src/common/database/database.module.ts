import { DynamicModule, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { color } from 'src/utils/ansi.utils';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import BreedSeeder from './seeds/breed.seeder';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
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
    ],
})
export class DatabaseModule {
    constructor(@Inject(getDataSourceToken()) private readonly dataSource: DataSource) {}

    async onModuleInit() {
        await runSeeders(this.dataSource, { seeds: [BreedSeeder] });
        console.log(color('Seed data applied successfully.', 'Cyan'));
    }

    static forFeature(models: EntityClassOrSchema[]): DynamicModule {
        return TypeOrmModule.forFeature(models);
    }
}
