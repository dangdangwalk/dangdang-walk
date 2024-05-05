import { Controller, Get } from '@nestjs/common';
import { SkipAuthGuard } from 'src/auth/decorators/public.decorator';

@Controller('health')
@SkipAuthGuard()
export class HealthController {

    @Get()
    check() {
        return {
            status: 'ok',
        };
    }
}
