import { HttpService } from '@nestjs/axios';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { GoogleService } from './oauth/google.service';
import { KakaoService } from './oauth/kakao.service';
import { NaverService } from './oauth/naver.service';
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from './token/token.service';
import { OauthAuthorizeData } from './types/oauth-authorize-data.type';
import { OauthData } from './types/oauth-data.type';
import { OAUTH_PROVIDERS } from './types/oauth-provider.type';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogsService } from '../dogs/dogs.service';
import { mockUser } from '../fixtures/users.fixture';
import { S3Service } from '../s3/s3.service';
import { Users } from '../users/users.entity';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let tokenService: TokenService;
    let googleService: GoogleService;
    let kakaoService: KakaoService;
    let naverService: NaverService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: S3Service,
                    useValue: { deleteObjectFolder: jest.fn() },
                },
                {
                    provide: UsersService,
                    useValue: { updateAndFindOne: jest.fn(), createIfNotExists: jest.fn(), findOne: jest.fn() },
                },
                {
                    provide: DogsService,
                    useValue: { deleteDogFromUser: jest.fn() },
                },
                { provide: UsersRepository, useValue: {} },
                TokenService,
                JwtService,
                { provide: HttpService, useValue: {} },
                GoogleService,
                KakaoService,
                NaverService,
                ConfigService,
                WinstonLoggerService,
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        tokenService = module.get<TokenService>(TokenService);
        googleService = module.get<GoogleService>(GoogleService);
        kakaoService = module.get<KakaoService>(KakaoService);
        naverService = module.get<NaverService>(NaverService);

        const oauthServiceList = [googleService, kakaoService, naverService];

        const mockTokenResponse = {
            access_token: mockUser.oauthAccessToken,
            expires_in: 3600,
            refresh_token: mockUser.oauthRefreshToken,
            refresh_token_expires_in: 3600,
            scope: 'scope',
            token_type: 'bearer',
        };

        for (const oauthService of oauthServiceList) {
            jest.spyOn(oauthService, 'requestToken').mockResolvedValue(mockTokenResponse);
            jest.spyOn(oauthService, 'requestUserInfo').mockResolvedValue({
                oauthId: mockUser.oauthId,
                oauthNickname: 'test',
                email: 'test@mail.com',
                profileImageUrl: 'test.jpg',
            });
            jest.spyOn(oauthService, 'requestTokenExpiration').mockResolvedValue();
            jest.spyOn(oauthService, 'requestTokenRefresh').mockResolvedValue(mockTokenResponse);
        }

        jest.spyOn(kakaoService, 'requestUnlink').mockResolvedValue();
        jest.spyOn(tokenService, 'signRefreshToken').mockResolvedValue(Promise.resolve(mockUser.refreshToken));
        jest.spyOn(tokenService, 'signAccessToken').mockResolvedValue(Promise.resolve(mockUser.refreshToken));
    });

    const authorizeCode = 'authorizeCode';

    describe('login', () => {
        context('사용자가 존재하면', () => {
            for (let i = 0; i < 3; i++) {
                const provider = OAUTH_PROVIDERS[i];
                it(`${provider} 로그인 후 access token과 refresh token을 반환해야 한다.`, async () => {
                    jest.spyOn(usersService, 'updateAndFindOne').mockResolvedValue({ id: 1 } as Users);

                    const result = await service.login({ authorizeCode, provider } as OauthAuthorizeData);

                    expect(result).toEqual({
                        accessToken: mockUser.refreshToken,
                        refreshToken: mockUser.refreshToken,
                    });
                });
            }
        });

        context('사용자가 존재하지 않으면', () => {
            for (let i = 0; i < 3; i++) {
                const provider = OAUTH_PROVIDERS[i];
                it(`${provider} 로그인 후 oauth data를 반환해야 한다.`, async () => {
                    jest.spyOn(usersService, 'updateAndFindOne').mockRejectedValue(new NotFoundException());

                    const result = await service.login({ authorizeCode, provider } as OauthAuthorizeData);

                    expect(result).toEqual({
                        oauthAccessToken: mockUser.oauthAccessToken,
                        oauthRefreshToken: mockUser.oauthRefreshToken,
                        provider,
                    });
                });
            }
        });
    });

    describe('signup', () => {
        context('사용자가 존재하지 않으면', () => {
            for (let i = 0; i < 3; i++) {
                const provider = OAUTH_PROVIDERS[i];
                it(`${provider} 회원가입 후 access token과 refresh token을 반환해야 한다.`, async () => {
                    jest.spyOn(usersService, 'createIfNotExists').mockResolvedValue({ id: 1 } as Users);

                    const result = await service.signup({
                        oauthAccessToken: mockUser.oauthAccessToken,
                        oauthRefreshToken: mockUser.oauthRefreshToken,
                        oauthId: mockUser.oauthId,
                        provider,
                    } as OauthData);

                    expect(result).toEqual({
                        accessToken: mockUser.refreshToken,
                        refreshToken: mockUser.refreshToken,
                    });
                });
            }
        });
    });

    describe('validateAccessToken', () => {
        context('access token이 주어지면', () => {
            it('access token을 검증해야 한다.', async () => {
                const userId = 1;
                const payload = { userId };
                jest.spyOn(tokenService, 'verify').mockImplementation(() =>
                    Promise.resolve(payload as AccessTokenPayload),
                );
                jest.spyOn(usersService, 'findOne').mockResolvedValue({ id: userId } as Users);

                const result = await service.validateAccessToken('accessToken');
                expect(result).toEqual(payload);
            });
        });
    });

    describe('validateRefreshToken', () => {
        const oauthId = '123';
        const payload = { oauthId };

        context('refresh token이 주어지면', () => {
            it('refresh token을 검증해야 한다.', async () => {
                jest.spyOn(tokenService, 'verify').mockReturnValue(Promise.resolve(payload as RefreshTokenPayload));
                jest.spyOn(usersService, 'findOne').mockResolvedValue({
                    oauthId: '123',
                    refreshToken: mockUser.refreshToken,
                } as Users);

                const result = await service.validateRefreshToken(mockUser.refreshToken);
                expect(result).toEqual(payload);
            });
        });

        context('주어진 refresh token이 저장된 refresh token과 다르면', () => {
            it('UnauthorizedException 예외를 던져야 한다.', async () => {
                jest.spyOn(tokenService, 'verify').mockReturnValue(Promise.resolve(payload as RefreshTokenPayload));
                jest.spyOn(usersService, 'findOne').mockResolvedValue({
                    oauthId: '123',
                    refreshToken: mockUser.refreshToken,
                } as Users);

                await expect(service.validateRefreshToken('refreshToken')).rejects.toThrow(UnauthorizedException);
            });
        });
    });
});
