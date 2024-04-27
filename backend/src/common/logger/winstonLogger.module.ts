import { Module } from '@nestjs/common';
import { WinstonLoggerService } from './winstonLogger.service';

@Module({
    providers: [WinstonLoggerService],
    exports: [WinstonLoggerService],
})
export class WinstonLoggerModule {}
