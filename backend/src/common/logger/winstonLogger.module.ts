import { Module, Logger } from '@nestjs/common';
import { WinstonLoggerService } from './winstonLogger.service';
@Module({
    providers: [WinstonLoggerService, Logger],
    exports: [WinstonLoggerService],
})
export class WinstonLoggerModule {}
