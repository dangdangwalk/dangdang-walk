import { Global, Logger, Module } from '@nestjs/common';

import { WinstonLoggerService } from './winstonLogger.service';

@Global()
@Module({
    providers: [WinstonLoggerService, Logger],
    exports: [WinstonLoggerService],
})
export class WinstonLoggerModule {}
