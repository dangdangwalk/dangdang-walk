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

interface TokenRefreshResponse extends RequestTokenRefreshResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

@Injectable()
export class NaverService extends OauthService {
    constructor(
        readonly configService: ConfigService,
        readonly httpService: HttpService,
        readonly logger: WinstonLoggerService,
    ) {
        super(configService, httpService, logger);
    }

    private readonly CLIENT_ID = this.configService.get<string>('NAVER_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('NAVER_CLIENT_SECRET');
    private readonly TOKEN_API = this.configService.get<string>('NAVER_TOKEN_API')!;
    private readonly USER_INFO_API = this.configService.get<string>('NAVER_USER_INFO_API')!;

    async login(authorizeCode: string, _redirectURI: string): Promise<OauthLoginData> {
        const tokens = await this.requestToken(authorizeCode);
        const userInfo = await this.requestUserInfo(tokens.access_token);

        return {
            oauthAccessToken: tokens.access_token,
            oauthRefreshToken: tokens.refresh_token,
            oauthId: userInfo.response.id,
            oauthNickname: userInfo.response.nickname,
            email: userInfo.response.email,
            profileImageUrl: userInfo.response.profile_image,
        };
    }

    async signup(oauthAccessToken: string): Promise<OauthSignupData> {
        const userInfo = await this.requestUserInfo(oauthAccessToken);

        return {
            oauthId: userInfo.response.id,
            oauthNickname: userInfo.response.nickname,
            email: userInfo.response.email,
            profileImageUrl: userInfo.response.profile_image,
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

    private async requestToken(authorizeCode: string): Promise<TokenResponse> {
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
                this.logger.error('Naver: Token 발급 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Naver: Token 발급 요청이 실패했습니다');
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
                this.logger.error('Naver: 유저 정보 조회 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Naver: 유저 정보 조회 요청이 실패했습니다');
            }
            throw error;
        }
    }

    private async requestTokenExpiration(accessToken: string): Promise<void> {
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
                this.logger.error('Naver: Token 만료 기간 조회 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Naver: Token 만료 기간 조회 요청이 실패했습니다');
            }
            throw error;
        }
    }

    private async requestTokenRefresh(refreshToken: string): Promise<TokenRefreshResponse> {
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
                this.logger.error('Naver: Token 갱신 요청이 실패했습니다', {
                    trace: error.stack ?? 'No stack',
                    response: error.response.data,
                });
                error = new BadRequestException('Naver: Token 갱신 요청이 실패했습니다');
            }
            throw error;
        }
    }
}
