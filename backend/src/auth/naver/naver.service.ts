import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthService, OAuthService } from '../auth.service';

interface requestTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

interface requestUserInfoResponse {
    resultcode: string;
    message: string;
    response: {
        id: string;
        [key: string]: any;
    };
}

@Injectable()
export class NaverService implements OAuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly authService: AuthService
    ) {}

    private readonly logger = new Logger(NaverService.name);
    private readonly CLIENT_ID = this.configService.get<string>('NAVER_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('NAVER_CLIENT_SECRET');
    private readonly PROVIDER = 'naver';

    async requestToken(autherizeCode: string) {
        const { data } = await firstValueFrom(
            this.httpService.post<requestTokenResponse>(
                `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}&code=${autherizeCode}&state=naverLoginState`
            )
        );

        return data;
    }

    async requestUserId(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get<requestUserInfoResponse>('https://openapi.naver.com/v1/nid/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );

        return data.response.id;
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
