import { BadRequestException, Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { OAuthController } from '../auth.controller';
import { ConfigService } from '@nestjs/config';
import { KakaoService } from './kakao.service';

@Controller('auth/kakao')
export class KakaoController implements OAuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly kakaoService: KakaoService
    ) {}

    private readonly logger = new Logger(KakaoController.name);
    private readonly AUTHORIZE_CODE_REQUEST_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.configService.get<string>('KAKAO_CLIENT_ID')}&redirect_uri=${this.configService.get<string>('KAKAO_REDIRECT_URI')}`;
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

        const { accessToken } = await this.kakaoService.login(autherizeCode);

        response.cookie('access-token', accessToken);
        response.redirect(this.CLIENT_REDIRECT_URL);
    }
}
