import { Body, Controller, Delete, Get, HttpCode, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from '../users/decorators/user.decorator';
import { AuthService, OauthData } from './auth.service';
import { OauthCookies } from './decorators/oauthData.decorator';
import { SkipAuthGuard } from './decorators/public.decorator';
import { OauthDataGuard } from './guards/oauthData.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { CookieInterceptor } from './interceptors/cookie.interceptor';
import { AccessTokenPayload, RefreshTokenPayload } from './token/token.service';

export type OauthProvider = 'google' | 'kakao' | 'naver';

export interface OauthBody {
    authorizeCode: string;
    provider: OauthProvider;
}

@Controller('/auth')
@UseInterceptors(CookieInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @HttpCode(200)
    @SkipAuthGuard()
    async login(@Body() oauthBody: OauthBody) {
        return await this.authService.login(oauthBody);
    }

    @Post('/signup')
    @SkipAuthGuard()
    @UseGuards(OauthDataGuard)
    async signup(@OauthCookies() oauthData: OauthData) {
        return await this.authService.signup(oauthData);
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
