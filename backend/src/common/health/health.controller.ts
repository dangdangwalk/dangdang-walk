import { Controller, Get, Logger } from '@nestjs/common';
import { SkipAuthGuard } from 'src/auth/decorators/public.decorator';

@Controller('health')
@SkipAuthGuard()
export class HealthController {
    private readonly logger = new Logger(HealthController.name);

    @Get()
    check() {
        this.logger.log('health check');
        return {
            status: 'ok',
        };
    }
}
