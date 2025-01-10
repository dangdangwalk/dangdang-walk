import { Module, Controller, Get } from '@nestjs/common';

import { LoggerModule } from './logger.module';

import { SkipAuthGuard } from '../auth/decorators/public.decorator';

@Controller('/health')
@SkipAuthGuard()
export class HealthController {
    @Get()
    check() {
        return {
            status: 'ok',
        };
    }
}

@Module({
    controllers: [HealthController],
    imports: [LoggerModule],
})
export class HealthModule {}
