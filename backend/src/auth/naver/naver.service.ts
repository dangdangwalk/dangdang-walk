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
export class NaverService extends OAuthService {
    constructor(configService: ConfigService, httpService: HttpService, authService: AuthService) {
        super(configService, httpService, authService, 'naver');
    }

    private readonly logger = new Logger(NaverService.name);
    private readonly CLIENT_ID = this.configService.get<string>('NAVER_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('NAVER_CLIENT_SECRET');

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
}
