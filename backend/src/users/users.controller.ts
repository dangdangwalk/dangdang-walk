import { Controller, Get } from '@nestjs/common';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';

@Controller('user')
export class UsersController {
  constructor(private readonly logger: WinstonLoggerService) {}

  @Get('/')
  testControllerForLogger(req: Request, res: Response) {
    this.logger.log('test');
  }
}
