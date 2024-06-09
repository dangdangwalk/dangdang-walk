import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';

import { OauthService, RequestToken, RequestTokenRefresh, RequestUserInfo } from './oauth.service.interface';

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
        nickname: string;
        email: string;
        profile_image: string;
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
        private readonly logger: WinstonLoggerService,
    ) {}

    private readonly CLIENT_ID = this.configService.get<string>('NAVER_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('NAVER_CLIENT_SECRET');
    private readonly TOKEN_API = this.configService.get<string>('NAVER_TOKEN_API')!;
    private readonly USER_INFO_API = this.configService.get<string>('NAVER_USER_INFO_API')!;

    async requestToken(authorizeCode: string): Promise<RequestToken> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<TokenResponse>(this.TOKEN_API, {
                    params: {
                        grant_type: 'authorization_code',
                        client_id: this.CLIENT_ID,
                        client_secret: this.CLIENT_SECRET,
                        code: authorizeCode,
                        state: 'naverLoginState',
                    },
                }),
            );

            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Naver: Failed to request token.', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Naver: Failed to request token.');
            }
            throw error;
        }
    }

    async requestUserInfo(accessToken: string): Promise<RequestUserInfo> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<UserInfoResponse>(this.USER_INFO_API, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            );

            this.logger.log('requestUserInfo', { ...data });

            return {
                oauthId: data.response.id,
                oauthNickname: data.response.nickname,
                email: data.response.email,
                profileImageUrl: data.response.profile_image,
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Naver: Failed to request userInfo.', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Naver: Failed to request userInfo.');
            }
            throw error;
        }
    }

    async requestTokenExpiration(accessToken: string) {
        try {
            await firstValueFrom(
                this.httpService.get<{ access_token: string; result: string }>(this.TOKEN_API, {
                    params: {
                        grant_type: 'delete',
                        client_id: this.CLIENT_ID,
                        client_secret: this.CLIENT_SECRET,
                        access_token: accessToken,
                        service_provider: 'NAVER',
                    },
                }),
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Naver: Failed to request token expiration.', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Naver: Failed to request token expiration.');
            }
            throw error;
        }
    }

    async requestTokenRefresh(refreshToken: string): Promise<RequestTokenRefresh> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<TokenRefreshResponse>(this.TOKEN_API, {
                    params: {
                        grant_type: 'refresh_token',
                        client_id: this.CLIENT_ID,
                        client_secret: this.CLIENT_SECRET,
                        refresh_token: refreshToken,
                    },
                }),
            );

            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Naver: Failed to request token refresh.', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Naver: Failed to request token refresh.');
            }
            throw error;
        }
    }
}
