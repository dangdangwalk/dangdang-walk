import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { mockUser } from 'src/fixture/users.fixture';
import { Users } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { OauthProvider } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './oauth/google.service';
import { KakaoService } from './oauth/kakao.service';
import { NaverService } from './oauth/naver.service';
import { TokenService } from './token/token.service';

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
                    provide: UsersService,
                    useValue: { updateAndFindOne: jest.fn(), createIfNotExists: jest.fn(), findOne: jest.fn() },
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
            jest.spyOn(oauthService, 'requestUserId').mockResolvedValue(mockUser.oauthId);
            jest.spyOn(oauthService, 'requestTokenExpiration').mockResolvedValue();
            jest.spyOn(oauthService, 'requestTokenRefresh').mockResolvedValue(mockTokenResponse);
        }

        jest.spyOn(kakaoService, 'requestUnlink').mockResolvedValue();

        jest.spyOn(tokenService, 'signRefreshToken').mockReturnValue(mockUser.refreshToken);
        jest.spyOn(tokenService, 'signAccessToken').mockReturnValue(mockUser.refreshToken);
    });

    const authorizeCode = 'authorizeCode';
    const providerList = ['google', 'kakao', 'naver'];

    describe('login', () => {
        for (let i = 0; i < 3; i++) {
            const provider = providerList[i];
            it(`${provider} 로그인 후 access token과 refresh token을 반환해야 한다.`, async () => {
                jest.spyOn(usersService, 'updateAndFindOne').mockResolvedValue({ id: 1 } as Users);

                const result = await service.login(authorizeCode, provider as OauthProvider, '/refresh');

                expect(result).toEqual({
                    accessToken: mockUser.refreshToken,
                    refreshToken: mockUser.refreshToken,
                });
            });
        }
    });

    describe('signup', () => {
        for (let i = 0; i < 3; i++) {
            const provider = providerList[i];
            it(`${provider} 회원가입 후 access token과 refresh token을 반환해야 한다.`, async () => {
                jest.spyOn(usersService, 'createIfNotExists').mockResolvedValue({ id: 1 } as Users);

                const result = await service.signup(authorizeCode, provider as OauthProvider, '/refresh');

                expect(result).toEqual({
                    accessToken: mockUser.refreshToken,
                    refreshToken: mockUser.refreshToken,
                });
            });
        }
    });

    describe('validateAccessToken', () => {
        it('userId에 해당하는 user가 존재하면 true를 반환해야 한다.', async () => {
            jest.spyOn(usersService, 'findOne').mockResolvedValue({ id: 1 } as Users);

            const result = await service.validateAccessToken(1);

            expect(result).toEqual(true);
        });

        it('userId에 해당하는 user가 존재하지 않으면 false를 반환해야 한다.', async () => {
            jest.spyOn(usersService, 'findOne').mockRejectedValue(new NotFoundException());

            const result = await service.validateAccessToken(1);

            expect(result).toEqual(false);
        });
    });

    describe('validateRefreshToken', () => {
        beforeEach(() => {
            jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
        });

        it('oauthId에 해당하는 user의 refresh token과 현재 token이 일치하면 true를 반환해야 한다.', async () => {
            const result = await service.validateRefreshToken(mockUser.refreshToken, mockUser.oauthId);

            expect(result).toEqual(true);
        });

        it('oauthId에 해당하는 user의 refresh token과 현재 token이 일치하지 않으면 false를 반환해야 한다.', async () => {
            const result = await service.validateRefreshToken(mockUser.oauthAccessToken, mockUser.oauthId);

            expect(result).toEqual(false);
        });
    });
});
