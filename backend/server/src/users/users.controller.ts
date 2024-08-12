import { Body, Controller, Get, HttpCode, Patch, UsePipes, ValidationPipe } from '@nestjs/common';

import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';

import { UsersService } from './users.service';

import { AccessTokenPayload } from '../auth/token/token.service';

@Controller('/users')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/me')
    async getUserProfile(@User() user: AccessTokenPayload) {
        return await this.usersService.getUserProfile(user);
    }

    @Patch('/me')
    @HttpCode(204)
    async updateUserProfile(@User() { userId }: AccessTokenPayload, @Body() userInfo: UpdateUserDto) {
        return await this.usersService.updateUserProfile(userId, userInfo);
    }
}
