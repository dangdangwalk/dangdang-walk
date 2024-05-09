import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { OauthService, RequestTokenRefreshResponse } from './oauth.service.interface';

interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

interface UserInfoResponse {
    azp: string;
    aud: string;
    sub: string;
    scope: string;
    exp: string;
    expires_in: string;
    email: string;
    email_verified: string;
}

interface TokenRefreshResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

@Injectable()
export class GoogleService implements OauthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly logger: WinstonLoggerService
    ) {}

    private readonly CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    private readonly TOKEN_API = this.configService.get<string>('GOOGLE_TOKEN_API')!;
    private readonly TOKEN_INFO_API = this.configService.get<string>('GOOGLE_TOKEN_INFO_API')!;
    private readonly REVOKE_API = this.configService.get<string>('GOOGLE_REVOKE_API')!;

    async requestToken(authorizeCode: string, redirectURI: string) {
        this.logger.log(`authorize code: ${authorizeCode}`);
        this.logger.log(`redirect URI: ${redirectURI}`);

        const { data } = await firstValueFrom(
            this.httpService.post<TokenResponse>(this.TOKEN_API, {
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
            this.httpService.get<UserInfoResponse>(this.TOKEN_INFO_API, {
                params: {
                    access_token: accessToken,
                },
            })
        );

        return data.sub;
    }

    async requestTokenExpiration(accessToken: string) {
        await firstValueFrom(
            this.httpService.post(
                this.REVOKE_API,
                {},
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    params: {
                        token: accessToken,
                    },
                }
            )
        );
    }

    async requestTokenRefresh(refreshToken: string): Promise<RequestTokenRefreshResponse> {
        const { data } = await firstValueFrom(
            this.httpService.post<TokenRefreshResponse>(this.TOKEN_API, {
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            })
        );

        return data;
    }
}
