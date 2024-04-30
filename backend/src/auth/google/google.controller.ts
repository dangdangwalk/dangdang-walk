import { BadRequestException, Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { OAuthController } from '../auth.controller';
import { ConfigService } from '@nestjs/config';
import { GoogleService } from './google.service';
import { TOKEN_LIFETIME_MAP } from '../auth.service';

@Controller('auth/google')
export class GoogleController implements OAuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly googleService: GoogleService
    ) {}

    private readonly logger = new Logger(GoogleController.name);
    private readonly AUTHORIZE_CODE_REQUEST_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.configService.get<string>('GOOGLE_CLIENT_ID')}&redirect_uri=${this.configService.get<string>('GOOGLE_REDIRECT_URI')}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
    private readonly CLIENT_REDIRECT_URL = this.configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

    @Get()
    async authorize(@Res({ passthrough: true }) response: Response) {
        response.redirect(this.AUTHORIZE_CODE_REQUEST_URL);
    }

    @Get('callback')
    async callback(
        @Query('code') autherizeCode: string,
        @Res({ passthrough: true }) response: Response,
        @Query('error') error: string,
        @Query('error_description') errorDescription: string
    ) {
        if (error) throw new BadRequestException(errorDescription ?? error);

        const { accessToken, refreshToken } = await this.googleService.login(autherizeCode);

        response.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: Boolean(this.configService.get<string>('NODE_ENV', 'test') === 'production'),
            maxAge: TOKEN_LIFETIME_MAP.access.maxAge,
        });
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: Boolean(this.configService.get<string>('NODE_ENV', 'test') === 'production'),
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        });
        response.redirect(this.CLIENT_REDIRECT_URL);
    }
}
