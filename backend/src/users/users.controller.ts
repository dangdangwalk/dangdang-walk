import { Controller } from '@nestjs/common';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly logger: WinstonLoggerService,
        private readonly userService: UsersService
    ) {}
}
