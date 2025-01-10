import { Module, Controller, Get } from '@nestjs/common';

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
})
export class HealthModule {}
