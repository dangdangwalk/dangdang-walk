import { ConfigService } from '@nestjs/config';
import { GoogleService } from './oauth/google.service';
import { KakaoService } from './oauth/kakao.service';
import { NaverService } from './oauth/naver.service';
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from './token/token.service';
import { AuthData } from './types/auth-data.type';
import { OauthAuthorizeData } from './types/oauth-authorize-data.type';
import { OauthData } from './types/oauth-data.type';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogsService } from '../dogs/dogs.service';
import { S3Service } from '../s3/s3.service';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly tokenService;
    private readonly usersService;
    private readonly dogsService;
    private readonly googleService;
    private readonly kakaoService;
    private readonly naverService;
    private readonly configService;
    private readonly s3Service;
    private readonly logger;
    constructor(
        tokenService: TokenService,
        usersService: UsersService,
        dogsService: DogsService,
        googleService: GoogleService,
        kakaoService: KakaoService,
        naverService: NaverService,
        configService: ConfigService,
        s3Service: S3Service,
        logger: WinstonLoggerService,
    );
    private readonly REDIRECT_URI;
    private readonly S3_PROFILE_IMAGE_PATH;
    login({ authorizeCode, provider }: OauthAuthorizeData): Promise<AuthData | OauthData | undefined>;
    signup({ oauthAccessToken, oauthRefreshToken, provider }: OauthData): Promise<AuthData>;
    logout({ userId, provider }: AccessTokenPayload): Promise<void>;
    reissueTokens({ oauthId, provider }: RefreshTokenPayload): Promise<AuthData>;
    deactivate({ userId, provider }: AccessTokenPayload): Promise<void>;
    private deleteUserData;
    validateAccessToken(token: string): Promise<AccessTokenPayload>;
    validateRefreshToken(token: string): Promise<RefreshTokenPayload>;
}
