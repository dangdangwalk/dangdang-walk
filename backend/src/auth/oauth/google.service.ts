import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { OauthService } from './oauth.service.interface';

interface requestTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
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

interface requestTokenRefreshResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

@Injectable()
export class GoogleService implements OauthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    private readonly CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    async requestToken(authorizeCode: string, redirectURI: string) {
        const { data } = await firstValueFrom(
            this.httpService.post<requestTokenResponse>(`https://oauth2.googleapis.com/token`, {
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                code: authorizeCode,
                grant_type: 'authorization_code',
                redirect_uri: redirectURI,
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

    async requestTokenExpiration(accessToken: string) {
        await firstValueFrom(
            this.httpService.post(
                `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            )
        );
    }

    async requestTokenRefresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token?: string;
        [key: string]: any;
    }> {
        const { data } = await firstValueFrom(
            this.httpService.post<requestTokenRefreshResponse>(`https://oauth2.googleapis.com/token`, {
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            })
        );

        return data;
    }
}
