import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
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
        try {
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
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error(
                    `Google: Failed to request token. ${JSON.stringify(error.response.data)}`,
                    error.stack ?? 'No stack'
                );
                error = new BadRequestException('Google: Failed to request token.');
            }
            throw error;
        }
    }

    async requestUserId(accessToken: string) {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<UserInfoResponse>(this.TOKEN_INFO_API, {
                    params: {
                        access_token: accessToken,
                    },
                })
            );

            return data.sub;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error(
                    `Google: Failed to request oauthId. ${JSON.stringify(error.response.data)}`,
                    error.stack ?? 'No stack'
                );
                error = new BadRequestException('Google: Failed to request oauthId.');
            }
            throw error;
        }
    }

    async requestTokenExpiration(accessToken: string) {
        try {
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
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error(
                    `Google: Failed to request token expiration. ${JSON.stringify(error.response.data)}`,
                    error.stack ?? 'No stack'
                );
                error = new BadRequestException('Google: Failed to request token expiration.');
            }
            throw error;
        }
    }

    async requestTokenRefresh(refreshToken: string): Promise<RequestTokenRefreshResponse> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.post<TokenRefreshResponse>(this.TOKEN_API, {
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                })
            );

            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error(
                    `Google: Failed to request token refresh. ${JSON.stringify(error.response.data)}`,
                    error.stack ?? 'No stack'
                );
                error = new BadRequestException('Google: Failed to request token refresh.');
            }
            throw error;
        }
    }
}
