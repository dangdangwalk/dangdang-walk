import { Module, Controller, Get } from '@nestjs/common';

import { SkipAuthGuard } from 'applications/auth/decorators/public.decorator';

import { LoggerModule } from './logger.module';

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
