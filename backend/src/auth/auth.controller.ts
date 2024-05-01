import { Body, Controller, Delete, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload, RefreshTokenPayload, TOKEN_LIFETIME_MAP } from './token/token.service';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { User } from 'src/users/decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';

export type OauthProvider = 'google' | 'kakao' | 'naver';

interface loginResponse {
    accessToken: string;
    expiresIn: number; // [s]
}

@Controller('auth')
export class AuthController {
    constructor(
        private configService: ConfigService,
        private authService: AuthService
    ) {}

    @Post('login')
    async login(
        @Body('authorizeCode') authorizeCode: string,
        @Body('provider') provider: OauthProvider,
        @Res({ passthrough: true }) response: Response
    ): Promise<loginResponse> {
        const { accessToken, refreshToken } = await this.authService.login(authorizeCode, provider);

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
    logout() {}

    @Delete('deactivate')
    @UseGuards(AuthGuard)
    async deactivate(@User() { userId }: AccessTokenPayload, @Res({ passthrough: true }) response: Response) {
        await this.authService.deactivate(userId);

        response.clearCookie('refreshToken');
    }

    @Get('token')
    @UseGuards(RefreshTokenGuard)
    async token(@User() { oauthId, provider }: RefreshTokenPayload, @Res({ passthrough: true }) response: Response) {
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
