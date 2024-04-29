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

    @Post('/check-member')
    @UsePipes(new ValidationPipe())
    async isMember(@Body() { userId, role }: IsMemberDto): Promise<{ isMember: boolean }> {
        const isMember = await this.userService.isMemberOrCreate(userId, role);
        return { isMember };
    }
}
