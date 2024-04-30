import { BadRequestException, Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { OAuthController } from '../auth.controller';
import { ConfigService } from '@nestjs/config';
import { NaverService } from './naver.service';
import { TOKEN_LIFETIME_MAP } from '../auth.service';

@Controller('auth/naver')
export class NaverController implements OAuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly naverService: NaverService
    ) {}

    private readonly logger = new Logger(NaverController.name);
    private readonly AUTHORIZE_CODE_REQUEST_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${this.configService.get<string>('NAVER_CLIENT_ID')}&redirect_uri=${encodeURI(this.configService.get<string>('NAVER_REDIRECT_URI', 'http://localhost:3333/auth/naver/callback'))}&state=naverLoginState`;
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
        if (error) throw new BadRequestException(errorDescription);

        const { accessToken, refreshToken } = await this.naverService.login(autherizeCode);

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
