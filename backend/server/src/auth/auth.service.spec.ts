import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { OauthService } from './oauth/oauth.service.base';
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from './token/token.service';
import { OauthAuthorizeData } from './types/oauth-authorize-data.type';
import { OauthData } from './types/oauth-data.type';
import { OAUTH_PROVIDERS } from './types/oauth-provider.type';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { DogsService } from '../dogs/dogs.service';
import { mockUser } from '../fixtures/users.fixture';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let tokenService: TokenService;
    let mockOauthServices: Map<string, OauthService>;

    beforeEach(async () => {
        mockOauthServices = new Map<string, OauthService>();

        const mockTokenResponse = {
            access_token: mockUser.oauthAccessToken,
            expires_in: 3600,
            refresh_token: mockUser.oauthRefreshToken,
            refresh_token_expires_in: 3600,
            scope: 'scope',
            token_type: 'bearer',
        };

        const mockUserInfo = {
            oauthId: mockUser.oauthId,
            oauthNickname: 'test',
            email: 'test@mail.com',
            profileImageUrl: 'test.jpg',
        };

        OAUTH_PROVIDERS.forEach((provider) => {
            const mockOauthService = {
                requestToken: jest.fn().mockResolvedValue(mockTokenResponse),
                requestUserInfo: jest.fn().mockResolvedValue(mockUserInfo),
                requestTokenExpiration: jest.fn().mockResolvedValue(undefined),
                requestTokenRefresh: jest.fn().mockResolvedValue(mockTokenResponse),
                requestUnlink: provider === 'kakao' ? jest.fn().mockResolvedValue(undefined) : undefined,
            };
            mockOauthServices.set(provider, mockOauthService as OauthService);
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                TokenService,
                {
                    provide: UsersService,
                    useValue: {
                        updateAndFindOne: jest.fn(),
                        createIfNotExists: jest.fn(),
                        findOne: jest.fn(),
                        delete: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: DogsService,
                    useValue: {
                        deleteOwnDogs: jest.fn(),
                    },
                },
                {
                    provide: 'OAUTH_SERVICES',
                    useValue: mockOauthServices,
                },
                ConfigService,
                JwtService,
                WinstonLoggerService,
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        tokenService = module.get<TokenService>(TokenService);

        jest.spyOn(tokenService, 'signRefreshToken').mockResolvedValue(mockUser.refreshToken);
        jest.spyOn(tokenService, 'signAccessToken').mockResolvedValue(mockUser.refreshToken);
    });

    const authorizeCode = 'authorizeCode';

    describe('login', () => {
        context('사용자가 존재하면', () => {
            for (const provider of OAUTH_PROVIDERS) {
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
            for (const provider of OAUTH_PROVIDERS) {
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
            for (const provider of OAUTH_PROVIDERS) {
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
