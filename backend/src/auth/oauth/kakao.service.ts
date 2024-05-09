import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { OauthService } from './oauth.service.interface';

interface TokenResponse {
    token_type: string;
    access_token: string;
    id_token?: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
    scope?: string;
}

interface UserInfoResponse {
    id: number;
    expires_in: number;
    app_id: number;
}

interface TokenRefreshResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    refresh_token_expires_in?: number;
}

@Injectable()
export class KakaoService implements OauthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly logger: WinstonLoggerService
    ) {}

    private readonly CLIENT_ID = this.configService.get<string>('KAKAO_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('KAKAO_CLIENT_SECRET');
    private readonly TOKEN_API = this.configService.get<string>('KAKAO_TOKEN_API')!;
    private readonly TOKEN_INFO_API = this.configService.get<string>('KAKAO_TOKEN_INFO_API')!;
    private readonly LOGOUT_API = this.configService.get<string>('KAKAO_LOGOUT_API')!;
    private readonly UNLINK_API = this.configService.get<string>('KAKAO_UNLINK_API')!;

    async requestToken(authorizeCode: string, redirectURI: string) {
        this.logger.log(`authorize code: ${authorizeCode}`);
        this.logger.log(`redirect URI: ${redirectURI}`);

        const { data } = await firstValueFrom(
            this.httpService.post<TokenResponse>(
                this.TOKEN_API,
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
            this.httpService.get<UserInfoResponse>(this.TOKEN_INFO_API, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );

        return data.id.toString();
    }

    async requestTokenExpiration(accessToken: string) {
        await firstValueFrom(
            this.httpService.post<{ id: number }>(
                this.LOGOUT_API,
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

    async requestUnlink(accessToken: string) {
        await firstValueFrom(
            this.httpService.post<{ id: number }>(
                this.UNLINK_API,
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

    async requestTokenRefresh(refreshToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.post<TokenRefreshResponse>(
                this.TOKEN_API,
                {
                    grant_type: 'refresh_token',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    refresh_token: refreshToken,
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
}
