import { Body, Controller, Delete, Get, HttpCode, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from '../users/decorators/user.decorator';
import { AuthService } from './auth.service';
import { SkipAuthGuard } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { CookieInterceptor } from './interceptors/cookie.interceptor';
import { AccessTokenPayload, RefreshTokenPayload } from './token/token.service';

export type OauthProvider = 'google' | 'kakao' | 'naver';

@Controller('auth')
@UseInterceptors(CookieInterceptor)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    @SkipAuthGuard()
    async login(@Body('authorizeCode') authorizeCode: string, @Body('provider') provider: OauthProvider) {
        return await this.authService.login(authorizeCode, provider);
    }

    @Post('signup')
    @SkipAuthGuard()
    async signup(@Body('authorizeCode') authorizeCode: string, @Body('provider') provider: OauthProvider) {
        return await this.authService.signup(authorizeCode, provider);
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@User() { userId, provider }: AccessTokenPayload) {
        return await this.authService.logout(userId, provider);
    }

    @Delete('deactivate')
    async deactivate(@User() { userId, provider }: AccessTokenPayload) {
        return await this.authService.deactivate(userId, provider);
    }

    @Get('token')
    @SkipAuthGuard()
    @UseGuards(RefreshTokenGuard)
    async token(@User() { oauthId, provider }: RefreshTokenPayload) {
        return await this.authService.reissueTokens(oauthId, provider);
    }
}
