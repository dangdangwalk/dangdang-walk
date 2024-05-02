import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { OauthService } from './oauth.service.interface';

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
    id: number;
    expires_in: number;
    app_id: number;
}

interface requestLogoutResponse {
    id: number;
}

@Injectable()
export class KakaoService implements OauthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    private readonly CLIENT_ID = this.configService.get<string>('KAKAO_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('KAKAO_CLIENT_SECRET');

    async requestToken(authorizeCode: string, redirectURI: string) {
        const { data } = await firstValueFrom(
            this.httpService.post<requestTokenResponse>(
                'https://kauth.kakao.com/oauth/token',
                {
                    code: authorizeCode,
                    grant_type: 'authorization_code',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    redirect_uri: redirectURI,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                }
            )
        );

        return data;
    }

    async requestUserId(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get<requestUserInfoResponse>('https://kapi.kakao.com/v1/user/access_token_info', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );

        return data.id.toString();
    }

    async requestLogout(accessToken: string) {
        await firstValueFrom(
            this.httpService.post<requestLogoutResponse>(
                'https://kapi.kakao.com/v1/user/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            )
        );
    }
}
