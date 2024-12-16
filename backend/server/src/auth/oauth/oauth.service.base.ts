import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';

export interface RequestTokenResponse {
    access_token: string;
    refresh_token: string;
    [key: string]: any;
}

export interface RequestTokenRefreshResponse extends Omit<RequestTokenResponse, 'refresh_token'> {
    refresh_token?: string;
}

interface UserInfo {
    oauthId: string;
    oauthNickname: string;
    email: string;
    profileImageUrl: string;
}

export interface OauthLoginData extends UserInfo {
    oauthAccessToken: string;
    oauthRefreshToken: string;
}

export interface OauthSignupData extends UserInfo {}

export interface OauthReissueData {
    oauthAccessToken: string;
    oauthRefreshToken?: string;
}

export abstract class OauthService {
    constructor(
        protected readonly configService: ConfigService,
        protected readonly httpService: HttpService,
        protected readonly logger: WinstonLoggerService,
    ) {}

    abstract login(authorizeCode: string, redirectURI: string): Promise<OauthLoginData>;
    abstract signup(oauthAccessToken: string): Promise<OauthSignupData>;
    abstract logout(oauthAccessToken: string): Promise<void>;
    abstract reissueTokens(oauthRefreshToken: string): Promise<OauthReissueData>;
    abstract deactivate(oauthAccessToken: string): Promise<void>;
}
