import { Controller } from '@nestjs/common';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';

@Controller('user')
export class UsersController {
    constructor(private readonly logger: WinstonLoggerService) {}
}
