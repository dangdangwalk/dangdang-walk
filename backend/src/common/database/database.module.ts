import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
    imports: [
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
                    synchronize: process.env.NODE_ENV === 'prod' ? false : true,
                };
            },
        }),
    ],
})
export class DatabaseModule {
    static forFeature(models: EntityClassOrSchema[]): DynamicModule {
        return TypeOrmModule.forFeature(models);
    }
}
