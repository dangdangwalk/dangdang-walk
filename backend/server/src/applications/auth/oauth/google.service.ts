import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';

import { WinstonLoggerService } from 'shared/logger';

import {
    OauthLoginData,
    OauthReissueData,
    OauthService,
    OauthSignupData,
    RequestTokenRefreshResponse,
    RequestTokenResponse,
} from './oauth.service.base';

interface TokenResponse extends RequestTokenResponse {
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

interface TokenRefreshResponse extends RequestTokenRefreshResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

@Injectable()
export class GoogleService extends OauthService {
    constructor(
        readonly configService: ConfigService,
        readonly httpService: HttpService,
        readonly logger: WinstonLoggerService,
    ) {
        super(configService, httpService, logger);
    }

    private readonly CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    private readonly TOKEN_API = this.configService.get<string>('GOOGLE_TOKEN_API')!;
    private readonly USER_INFO_API = this.configService.get<string>('GOOGLE_USER_INFO_API')!;
    private readonly REVOKE_API = this.configService.get<string>('GOOGLE_REVOKE_API')!;

    async login(authorizeCode: string, redirectURI: string): Promise<OauthLoginData> {
        const tokens = await this.requestToken(authorizeCode, redirectURI);
        const userInfo = await this.requestUserInfo(tokens.access_token);

        return {
            oauthAccessToken: tokens.access_token,
            oauthRefreshToken: tokens.refresh_token,
            oauthId: userInfo.id,
            oauthNickname: userInfo.name,
            email: userInfo.email,
            profileImageUrl: userInfo.picture,
        };
    }

    async signup(oauthAccessToken: string): Promise<OauthSignupData> {
        const userInfo = await this.requestUserInfo(oauthAccessToken);

        return {
            oauthId: userInfo.id,
            oauthNickname: userInfo.name,
            email: userInfo.email,
            profileImageUrl: userInfo.picture,
        };
    }

    async logout(_oauthAccessToken: string): Promise<void> {}

    async reissueTokens(oauthRefreshToken: string): Promise<OauthReissueData> {
        const tokens = await this.requestTokenRefresh(oauthRefreshToken);

        return { oauthAccessToken: tokens.access_token, oauthRefreshToken: tokens.refresh_token };
    }

    async deactivate(oauthAccessToken: string): Promise<void> {
        await this.requestTokenExpiration(oauthAccessToken);
    }

    private async requestToken(authorizeCode: string, redirectURI: string): Promise<TokenResponse> {
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

    private async requestUserInfo(accessToken: string): Promise<UserInfoResponse> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<UserInfoResponse>(this.USER_INFO_API, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            );

            this.logger.log('requestUserInfo', { ...data });

            return data;
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

    private async requestTokenExpiration(accessToken: string): Promise<void> {
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

    private async requestTokenRefresh(refreshToken: string): Promise<TokenRefreshResponse> {
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
