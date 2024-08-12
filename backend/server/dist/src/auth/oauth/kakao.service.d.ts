import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OauthService, RequestToken, RequestTokenRefresh, RequestUserInfo } from './oauth.service.interface';
import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
export declare class KakaoService implements OauthService {
    private readonly configService;
    private readonly httpService;
    private readonly logger;
    constructor(configService: ConfigService, httpService: HttpService, logger: WinstonLoggerService);
    private readonly CLIENT_ID;
    private readonly CLIENT_SECRET;
    private readonly TOKEN_API;
    private readonly USER_INFO_API;
    private readonly LOGOUT_API;
    private readonly UNLINK_API;
    requestToken(authorizeCode: string, redirectURI: string): Promise<RequestToken>;
    requestUserInfo(accessToken: string): Promise<RequestUserInfo>;
    requestTokenExpiration(accessToken: string): Promise<void>;
    requestUnlink(accessToken: string): Promise<void>;
    requestTokenRefresh(refreshToken: string): Promise<RequestTokenRefresh>;
}
