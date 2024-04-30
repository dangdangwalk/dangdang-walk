import { Controller } from '@nestjs/common';
import { OAuthController } from '../auth.controller';
import { ConfigService } from '@nestjs/config';
import { KakaoService } from './kakao.service';

@Controller('auth/kakao')
export class KakaoController extends OAuthController {
    constructor(configService: ConfigService, kakaoService: KakaoService) {
        super(configService, kakaoService);
    }

    protected readonly AUTHORIZE_CODE_REQUEST_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.configService.get<string>('KAKAO_CLIENT_ID')}&redirect_uri=${this.configService.get<string>('KAKAO_REDIRECT_URI')}`;
}
