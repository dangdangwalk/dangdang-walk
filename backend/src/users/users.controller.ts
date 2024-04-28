import { Body, Controller, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { UsersService } from './users.service';
import { IsMemberDto } from './dtos/is-member.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly logger: WinstonLoggerService,
        private readonly userService: UsersService
    ) {}

    @Post('/is-member-of')
    @UsePipes(new ValidationPipe())
    async isMember(@Body() body: IsMemberDto) {
        const isMember = await this.userService.isMemberOrCreate(body.userId, body.role);
        return { isMember };
    }
}
