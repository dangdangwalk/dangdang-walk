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

@Injectable()
export class GoogleService implements OauthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    private readonly CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    private readonly REDIRECT_URI = this.configService.get<string>('GOOGLE_REDIRECT_URI');

    async requestToken(authorizeCode: string) {
        const { data } = await firstValueFrom(
            this.httpService.post<requestTokenResponse>(`https://oauth2.googleapis.com/token`, {
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                code: authorizeCode,
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
}
