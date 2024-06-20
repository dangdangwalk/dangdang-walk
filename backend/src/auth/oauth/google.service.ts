import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';

import { OauthService, RequestToken, RequestTokenRefresh, RequestUserInfo } from './oauth.service.interface';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';

interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

interface UserInfoResponse {
    id: string;
    email: string;
    name: string;
    picture: string;
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
        private readonly logger: WinstonLoggerService,
    ) {}

    private readonly CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    private readonly TOKEN_API = this.configService.get<string>('GOOGLE_TOKEN_API')!;
    private readonly USER_INFO_API = this.configService.get<string>('GOOGLE_USER_INFO_API')!;
    private readonly REVOKE_API = this.configService.get<string>('GOOGLE_REVOKE_API')!;

    async requestToken(authorizeCode: string, redirectURI: string): Promise<RequestToken> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.post<TokenResponse>(this.TOKEN_API, {
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    code: authorizeCode,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectURI,
                }),
            );

            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Google: Token 발급 요청이 실패했습니다', {
                    trace: error.stack ?? '스택 없음',
                    response: error.response.data,
                });
                error = new BadRequestException('Google: Token 발급 요청이 실패했습니다');
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
                oauthId: data.id,
                oauthNickname: data.name,
                email: data.email,
                profileImageUrl: data.picture,
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Google: 유저 정보 조회 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Google: 유저 정보 조회 요청이 실패했습니다');
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
                    },
                ),
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Google: Token 만료 기간 조회 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Google: Token 만료 기간 조회 요청이 실패했습니다');
            }
            throw error;
        }
    }

    async requestTokenRefresh(refreshToken: string): Promise<RequestTokenRefresh> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.post<TokenRefreshResponse>(this.TOKEN_API, {
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                }),
            );

            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                this.logger.error('Google: Token 갱신 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Google: Token 갱신 요청이 실패했습니다');
            }
            throw error;
        }
    }
}
