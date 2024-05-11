import { Body, Controller, Delete, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from '../users/decorators/user.decorator';
import { AuthService } from './auth.service';
import { SkipAuthGuard } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AccessTokenPayload, RefreshTokenPayload, TOKEN_LIFETIME_MAP } from './token/token.service';

export type OauthProvider = 'google' | 'kakao' | 'naver';

@Controller('auth')
export class AuthController {
    constructor(
        private configService: ConfigService,
        private authService: AuthService
    ) {}

    @Post('login')
    @HttpCode(200)
    @SkipAuthGuard()
    async login(
        @Body('authorizeCode') authorizeCode: string,
        @Body('provider') provider: OauthProvider,
        @Res({ passthrough: true }) response: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.login(authorizeCode, provider);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'prod' ? true : false,
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        });

        response.cookie('isLoggedIn', true, {
            secure: this.configService.get<string>('NODE_ENV') === 'prod' ? true : false,
            maxAge: TOKEN_LIFETIME_MAP.access.maxAge,
        });

        response.cookie('expiresIn', TOKEN_LIFETIME_MAP.access.maxAge, {
            secure: this.configService.get<string>('NODE_ENV') === 'prod' ? true : false,
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        });

        return {
            accessToken,
        };
    }

    @Post('signup')
    @SkipAuthGuard()
    async signup(
        @Body('authorizeCode') authorizeCode: string,
        @Body('provider') provider: OauthProvider,
        @Res({ passthrough: true }) response: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.signup(authorizeCode, provider);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'prod' ? true : false,
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        });

        response.cookie('isLoggedIn', true, {
            secure: this.configService.get<string>('NODE_ENV') === 'prod' ? true : false,
            maxAge: TOKEN_LIFETIME_MAP.access.maxAge,
        });

        response.cookie('expiresIn', TOKEN_LIFETIME_MAP.access.maxAge, {
            secure: this.configService.get<string>('NODE_ENV') === 'prod' ? true : false,
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        });

        return {
            accessToken,
        };
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@User() { userId, provider }: AccessTokenPayload, @Res({ passthrough: true }) response: Response) {
        await this.authService.logout(userId, provider);

        response.clearCookie('refreshToken');
        response.clearCookie('isLoggedIn');
        response.clearCookie('expiresIn');
    }

    @Delete('deactivate')
    async deactivate(@User() { userId, provider }: AccessTokenPayload, @Res({ passthrough: true }) response: Response) {
        await this.authService.deactivate(userId, provider);

        response.clearCookie('refreshToken');
        response.clearCookie('isLoggedIn');
        response.clearCookie('expiresIn');
    }

    @Get('token')
    @SkipAuthGuard()
    @UseGuards(RefreshTokenGuard)
    async token(@User() { oauthId, provider }: RefreshTokenPayload, @Res({ passthrough: true }) response: Response) {
        const { accessToken, refreshToken } = await this.authService.reissueTokens(oauthId, provider);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'prod' ? true : false,
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        });

        response.cookie('isLoggedIn', true, {
            secure: this.configService.get<string>('NODE_ENV') === 'prod' ? true : false,
            maxAge: TOKEN_LIFETIME_MAP.access.maxAge,
        });

        response.cookie('expiresIn', TOKEN_LIFETIME_MAP.access.maxAge, {
            secure: this.configService.get<string>('NODE_ENV') === 'prod' ? true : false,
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        });

        return {
            accessToken,
        };
    }
}
