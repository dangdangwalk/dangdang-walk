import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { OauthService, RequestTokenRefreshResponse } from './oauth.service.interface';

interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

interface UserInfoResponse {
    resultcode: string;
    message: string;
    response: {
        id: string;
        [key: string]: any;
    };
}

interface TokenRefreshResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

@Injectable()
export class NaverService implements OauthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly logger: WinstonLoggerService
    ) {}

    private readonly CLIENT_ID = this.configService.get<string>('NAVER_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('NAVER_CLIENT_SECRET');
    private readonly TOKEN_API = this.configService.get<string>('NAVER_TOKEN_API')!;
    private readonly USER_INFO_API = this.configService.get<string>('NAVER_USER_INFO_API')!;

    async requestToken(authorizeCode: string) {
        this.logger.log(`authorize code: ${authorizeCode}`);

        const { data } = await firstValueFrom(
            this.httpService.get<TokenResponse>(this.TOKEN_API, {
                params: {
                    grant_type: 'authorization_code',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    code: authorizeCode,
                    state: 'naverLoginState',
                },
            })
        );

        return data;
    }

    async requestUserId(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get<UserInfoResponse>(this.USER_INFO_API, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );

        return data.response.id;
    }

    async requestTokenExpiration(accessToken: string) {
        await firstValueFrom(
            this.httpService.get<{ access_token: string; result: string }>(this.TOKEN_API, {
                params: {
                    grant_type: 'delete',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    access_token: accessToken,
                    service_provider: 'NAVER',
                },
            })
        );
    }

    async requestTokenRefresh(refreshToken: string): Promise<RequestTokenRefreshResponse> {
        const { data } = await firstValueFrom(
            this.httpService.get<TokenRefreshResponse>(this.TOKEN_API, {
                params: {
                    grant_type: 'refresh_token',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    refresh_token: refreshToken,
                },
            })
        );

        return data;
    }
}
