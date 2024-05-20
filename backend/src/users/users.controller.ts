import { Body, Controller, Get, Patch } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { User } from '../users/decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    async getUserProfile(@User() user: AccessTokenPayload) {
        return await this.usersService.getUserProfile(user);
    }

    @Patch('me')
    async updateUserProfile(@User() { userId }: AccessTokenPayload, @Body() userInfo: UpdateUserDto) {
        return await this.usersService.updateUserProfile(userId, userInfo);
    }
}
