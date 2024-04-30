import { Controller } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { ConfigService } from '@nestjs/config';
import { NaverService } from './naver.service';

@Controller('auth/naver')
export class NaverController extends AuthController {
    constructor(configService: ConfigService, naverService: NaverService) {
        super(configService, naverService);
    }

    protected readonly AUTHORIZE_CODE_REQUEST_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${this.configService.get<string>('NAVER_CLIENT_ID')}&redirect_uri=${encodeURI(this.configService.get<string>('NAVER_REDIRECT_URI', 'http://localhost:3333/auth/naver/callback'))}&state=naverLoginState`;
}
