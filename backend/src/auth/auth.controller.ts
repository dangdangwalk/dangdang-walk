import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Post,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { OauthCookies } from './decorators/oauth-data.decorator';
import { SkipAuthGuard } from './decorators/public.decorator';
import { OauthAuthorizeDto } from './dtos/oauth-authorize.dto';
import { OauthDto } from './dtos/oauth.dto';
import { OauthDataGuard } from './guards/oauth-data.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CookieInterceptor } from './interceptors/cookie.interceptor';
import { AccessTokenPayload, RefreshTokenPayload } from './token/token.service';

import { User } from '../users/decorators/user.decorator';

@Controller('/auth')
@UseInterceptors(CookieInterceptor)
@UsePipes(new ValidationPipe({ validateCustomDecorators: true, whitelist: true }))
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @HttpCode(200)
    @SkipAuthGuard()
    async login(@Body() oauthAuthorizeDTO: OauthAuthorizeDto) {
        return await this.authService.login(oauthAuthorizeDTO);
    }

    @Post('/signup')
    @SkipAuthGuard()
    @UseGuards(OauthDataGuard)
    async signup(@OauthCookies() oauthDTO: OauthDto) {
        return await this.authService.signup(oauthDTO);
    }

    @Post('/logout')
    @HttpCode(200)
    async logout(@User() user: AccessTokenPayload) {
        return await this.authService.logout(user);
    }

    @Get('/token')
    @SkipAuthGuard()
    @UseGuards(RefreshTokenGuard)
    async token(@User() user: RefreshTokenPayload) {
        return await this.authService.reissueTokens(user);
    }

    @Delete('/deactivate')
    async deactivate(@User() user: AccessTokenPayload) {
        return await this.authService.deactivate(user);
    }
}
