import { DynamicModule } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource } from 'typeorm';
import { WinstonLoggerService } from '../logger/winstonLogger.service';
export declare class DatabaseModule {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource, logger: WinstonLoggerService);
    onModuleInit(): Promise<void>;
    static forFeature(models: EntityClassOrSchema[]): DynamicModule;
}
