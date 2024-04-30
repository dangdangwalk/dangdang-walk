import { Controller } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { ConfigService } from '@nestjs/config';
import { GoogleService } from './google.service';

@Controller('auth/google')
export class GoogleController extends AuthController {
    constructor(configService: ConfigService, googleService: GoogleService) {
        super(configService, googleService);
    }

    protected readonly AUTHORIZE_CODE_REQUEST_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.configService.get<string>('GOOGLE_CLIENT_ID')}&redirect_uri=${this.configService.get<string>('GOOGLE_REDIRECT_URI')}&access_type=offline&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
}
