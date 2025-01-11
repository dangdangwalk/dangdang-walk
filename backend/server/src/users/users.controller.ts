import { Body, Controller, Get, HttpCode, Patch, UsePipes, ValidationPipe } from '@nestjs/common';

import { AccessTokenPayload } from 'applications/auth/token/token.service';

import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';

import { UsersService } from './users.service';

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
