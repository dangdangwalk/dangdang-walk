import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthService, OAuthService } from '../auth.service';

interface requestTokenResponse {
    token_type: string;
    access_token: string;
    id_token?: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
    scope?: string;
}

interface requestUserInfoResponse {
    azp: string;
    aud: string;
    sub: string;
    scope: string;
    exp: string;
    expires_in: string;
    email: string;
    email_verified: string;
}

@Injectable()
export class GoogleService implements OAuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly authService: AuthService
    ) {}

    private readonly logger = new Logger(GoogleService.name);
    private readonly CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    private readonly REDIRECT_URI = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    private readonly PROVIDER = 'google';

    async requestToken(autherizeCode: string) {
        const { data } = await firstValueFrom(
            this.httpService.post<requestTokenResponse>(`https://oauth2.googleapis.com/token`, {
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                code: autherizeCode,
                grant_type: 'authorization_code',
                redirect_uri: this.REDIRECT_URI,
            })
        );

        return data;
    }

    async requestUserId(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get<requestUserInfoResponse>(
                `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
            )
        );

        return data.sub;
    }

    async login(autherizeCode: string) {
        const { access_token: oauthAccessToken } = await this.requestToken(autherizeCode);
        const oauthId = await this.requestUserId(oauthAccessToken);

        // oauthId가 users table에 존재하는지 확인해서 로그인 or 회원가입 처리하고 userId 가져오기
        const userId = 1;
        const accessToken = this.authService.signToken(userId, 'access', this.PROVIDER);
        const refreshToken = this.authService.signToken(userId, 'refresh', this.PROVIDER);
        // users table에 refreshToken 저장

        return { accessToken, refreshToken };
    }
}
