import { Controller, Get } from '@nestjs/common';
import { SkipAuthGuard } from 'applications/auth/decorators/public.decorator';

@Controller()
export class AppController {
    @Get()
    @SkipAuthGuard()
    getHello(): string {
        return 'Hello World!';
    }
}
