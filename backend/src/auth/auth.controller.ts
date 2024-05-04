import { Body, Controller, Delete, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload, RefreshTokenPayload, TOKEN_LIFETIME_MAP } from './token/token.service';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { User } from 'src/users/decorators/user.decorator';
import { SkipAuthGuard } from './decorators/public.decorator';

export type OauthProvider = 'google' | 'kakao' | 'naver';

interface accessTokenResponse {
    accessToken: string;
    expiresIn: number; // [s]
}

@Controller('auth')
export class AuthController {
    constructor(
        private configService: ConfigService,
        private authService: AuthService
    ) {}

    @Post('is-user')
    @HttpCode(200)
    @SkipAuthGuard()
    async isUser(
        @Body('oauthAccessToken') oauthAccessToken: string,
        @Body('provider') provider: OauthProvider
    ): Promise<{ isUser: boolean }> {
        const isUser = await this.authService.isUser(oauthAccessToken, provider);

        return { isUser };
    }

    @Post('login')
    @SkipAuthGuard()
    async login(
        @Body('oauthAccessToken') oauthAccessToken: string,
        @Body('oauthRefreshToken') oauthRefreshToken: string,
        @Body('provider') provider: OauthProvider,
        @Res({ passthrough: true }) response: Response
    ): Promise<accessTokenResponse> {
        const { accessToken, refreshToken } = await this.authService.login(
            oauthAccessToken,
            oauthRefreshToken,
            provider
        );

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: Boolean(this.configService.get<string>('NODE_ENV', 'test') === 'production'),
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        });

        return {
            accessToken,
            expiresIn: TOKEN_LIFETIME_MAP.access.maxAge / 1000,
        };
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@User() { userId, provider }: AccessTokenPayload, @Res({ passthrough: true }) response: Response) {
        await this.authService.logout(userId, provider);

        response.clearCookie('refreshToken');
    }

    @Delete('deactivate')
    async deactivate(@User() { userId, provider }: AccessTokenPayload, @Res({ passthrough: true }) response: Response) {
        await this.authService.deactivate(userId, provider);

        response.clearCookie('refreshToken');
    }

    @Get('token')
    @SkipAuthGuard()
    @UseGuards(RefreshTokenGuard)
    async token(
        @User() { oauthId, provider }: RefreshTokenPayload,
        @Res({ passthrough: true }) response: Response
    ): Promise<accessTokenResponse> {
        const { accessToken, refreshToken } = await this.authService.reissueTokens(oauthId, provider);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: Boolean(this.configService.get<string>('NODE_ENV', 'test') === 'production'),
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        });

        return {
            accessToken,
            expiresIn: TOKEN_LIFETIME_MAP.access.maxAge / 1000,
        };
    }
}
