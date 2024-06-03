import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { OauthService, RequestToken, RequestTokenRefresh, RequestUserInfo } from './oauth.service.interface';

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
    properties: {
        nickname: string;
        profile_image: string;
    };
    kakao_account: {
        email: string;
    };
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
        private readonly logger: WinstonLoggerService,
    ) {}

    private readonly CLIENT_ID = this.configService.get<string>('KAKAO_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('KAKAO_CLIENT_SECRET');
    private readonly TOKEN_API = this.configService.get<string>('KAKAO_TOKEN_API')!;
    private readonly USER_INFO_API = this.configService.get<string>('KAKAO_USER_INFO_API')!;
    private readonly LOGOUT_API = this.configService.get<string>('KAKAO_LOGOUT_API')!;
    private readonly UNLINK_API = this.configService.get<string>('KAKAO_UNLINK_API')!;

    async requestToken(authorizeCode: string, redirectURI: string): Promise<RequestToken> {
        try {
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
                    },
                ),
            );

            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error(`Kakao: Failed to request token.`, error.stack ?? 'No stack', {
                    response: error.response.data,
                });
                error = new BadRequestException('Kakao: Failed to request token.');
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
                oauthId: data.id.toString(),
                oauthNickname: data.properties.nickname,
                email: data.kakao_account.email,
                profileImageUrl: data.properties.profile_image,
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Kakao: Failed to request userInfo.', error.stack ?? 'No stack', {
                    response: error.response.data,
                });
                error = new BadRequestException('Kakao: Failed to request userInfo.');
            }
            throw error;
        }
    }

    async requestTokenExpiration(accessToken: string) {
        try {
            await firstValueFrom(
                this.httpService.post<{ id: number }>(
                    this.LOGOUT_API,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    },
                ),
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Kakao: Failed to request token expiration.', error.stack ?? 'No stack', {
                    response: error.response.data,
                });
                error = new BadRequestException('Kakao: Failed to request token expiration.');
            }
            throw error;
        }
    }

    async requestUnlink(accessToken: string) {
        try {
            await firstValueFrom(
                this.httpService.post<{ id: number }>(
                    this.UNLINK_API,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    },
                ),
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Kakao: Failed to request unlink.', error.stack ?? 'No stack', {
                    response: error.response.data,
                });
                error = new BadRequestException('Kakao: Failed to request unlink.');
            }
            throw error;
        }
    }

    async requestTokenRefresh(refreshToken: string): Promise<RequestTokenRefresh> {
        try {
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
                    },
                ),
            );

            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Kakao: Failed to request token refresh.', error.stack ?? 'No stack', {
                    response: error.response.data,
                });
                error = new BadRequestException('Kakao: Failed to request token refresh.');
            }
            throw error;
        }
    }
}
