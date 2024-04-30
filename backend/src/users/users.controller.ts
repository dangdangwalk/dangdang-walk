import { Body, Controller, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { UsersService } from './users.service';
import { CheckMemberDto } from './dtos/check-member.dto';
import { Role } from './user-roles.enum';

@Controller('users')
export class UsersController {
    constructor(
        private readonly logger: WinstonLoggerService,
        private readonly userService: UsersService
    ) {}

    @Post('/check-member')
    @UsePipes(new ValidationPipe())
    async isMember(@Body() { userId, role }: CheckMemberDto): Promise<{ isMember: boolean }> {
        const isMember = await this.userService.isMemberOrCreate(userId, role);
        return { isMember };
    }
}
