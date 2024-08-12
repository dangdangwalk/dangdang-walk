"use strict";
const _axios = require("@nestjs/axios");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _jwt = require("@nestjs/jwt");
const _testing = require("@nestjs/testing");
const _authservice = require("./auth.service");
const _googleservice = require("./oauth/google.service");
const _kakaoservice = require("./oauth/kakao.service");
const _naverservice = require("./oauth/naver.service");
const _tokenservice = require("./token/token.service");
const _oauthprovidertype = require("./types/oauth-provider.type");
const _winstonLoggerservice = require("../common/logger/winstonLogger.service");
const _dogsservice = require("../dogs/dogs.service");
const _usersfixture = require("../fixtures/users.fixture");
const _s3service = require("../s3/s3.service");
const _usersrepository = require("../users/users.repository");
const _usersservice = require("../users/users.service");
describe('AuthService', ()=>{
    let service;
    let usersService;
    let tokenService;
    let googleService;
    let kakaoService;
    let naverService;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _authservice.AuthService,
                {
                    provide: _s3service.S3Service,
                    useValue: {
                        deleteObjectFolder: jest.fn()
                    }
                },
                {
                    provide: _usersservice.UsersService,
                    useValue: {
                        updateAndFindOne: jest.fn(),
                        createIfNotExists: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: _dogsservice.DogsService,
                    useValue: {
                        deleteDogFromUser: jest.fn()
                    }
                },
                {
                    provide: _usersrepository.UsersRepository,
                    useValue: {}
                },
                _tokenservice.TokenService,
                _jwt.JwtService,
                {
                    provide: _axios.HttpService,
                    useValue: {}
                },
                _googleservice.GoogleService,
                _kakaoservice.KakaoService,
                _naverservice.NaverService,
                _config.ConfigService,
                _winstonLoggerservice.WinstonLoggerService
            ]
        }).compile();
        service = module.get(_authservice.AuthService);
        usersService = module.get(_usersservice.UsersService);
        tokenService = module.get(_tokenservice.TokenService);
        googleService = module.get(_googleservice.GoogleService);
        kakaoService = module.get(_kakaoservice.KakaoService);
        naverService = module.get(_naverservice.NaverService);
        const oauthServiceList = [
            googleService,
            kakaoService,
            naverService
        ];
        const mockTokenResponse = {
            access_token: _usersfixture.mockUser.oauthAccessToken,
            expires_in: 3600,
            refresh_token: _usersfixture.mockUser.oauthRefreshToken,
            refresh_token_expires_in: 3600,
            scope: 'scope',
            token_type: 'bearer'
        };
        for (const oauthService of oauthServiceList){
            jest.spyOn(oauthService, 'requestToken').mockResolvedValue(mockTokenResponse);
            jest.spyOn(oauthService, 'requestUserInfo').mockResolvedValue({
                oauthId: _usersfixture.mockUser.oauthId,
                oauthNickname: 'test',
                email: 'test@mail.com',
                profileImageUrl: 'test.jpg'
            });
            jest.spyOn(oauthService, 'requestTokenExpiration').mockResolvedValue();
            jest.spyOn(oauthService, 'requestTokenRefresh').mockResolvedValue(mockTokenResponse);
        }
        jest.spyOn(kakaoService, 'requestUnlink').mockResolvedValue();
        jest.spyOn(tokenService, 'signRefreshToken').mockResolvedValue(Promise.resolve(_usersfixture.mockUser.refreshToken));
        jest.spyOn(tokenService, 'signAccessToken').mockResolvedValue(Promise.resolve(_usersfixture.mockUser.refreshToken));
    });
    const authorizeCode = 'authorizeCode';
    describe('login', ()=>{
        context('사용자가 존재하면', ()=>{
            for(let i = 0; i < 3; i++){
                const provider = _oauthprovidertype.OAUTH_PROVIDERS[i];
                it(`${provider} 로그인 후 access token과 refresh token을 반환해야 한다.`, async ()=>{
                    jest.spyOn(usersService, 'updateAndFindOne').mockResolvedValue({
                        id: 1
                    });
                    const result = await service.login({
                        authorizeCode,
                        provider
                    });
                    expect(result).toEqual({
                        accessToken: _usersfixture.mockUser.refreshToken,
                        refreshToken: _usersfixture.mockUser.refreshToken
                    });
                });
            }
        });
        context('사용자가 존재하지 않으면', ()=>{
            for(let i = 0; i < 3; i++){
                const provider = _oauthprovidertype.OAUTH_PROVIDERS[i];
                it(`${provider} 로그인 후 oauth data를 반환해야 한다.`, async ()=>{
                    jest.spyOn(usersService, 'updateAndFindOne').mockRejectedValue(new _common.NotFoundException());
                    const result = await service.login({
                        authorizeCode,
                        provider
                    });
                    expect(result).toEqual({
                        oauthAccessToken: _usersfixture.mockUser.oauthAccessToken,
                        oauthRefreshToken: _usersfixture.mockUser.oauthRefreshToken,
                        provider
                    });
                });
            }
        });
    });
    describe('signup', ()=>{
        context('사용자가 존재하지 않으면', ()=>{
            for(let i = 0; i < 3; i++){
                const provider = _oauthprovidertype.OAUTH_PROVIDERS[i];
                it(`${provider} 회원가입 후 access token과 refresh token을 반환해야 한다.`, async ()=>{
                    jest.spyOn(usersService, 'createIfNotExists').mockResolvedValue({
                        id: 1
                    });
                    const result = await service.signup({
                        oauthAccessToken: _usersfixture.mockUser.oauthAccessToken,
                        oauthRefreshToken: _usersfixture.mockUser.oauthRefreshToken,
                        oauthId: _usersfixture.mockUser.oauthId,
                        provider
                    });
                    expect(result).toEqual({
                        accessToken: _usersfixture.mockUser.refreshToken,
                        refreshToken: _usersfixture.mockUser.refreshToken
                    });
                });
            }
        });
    });
    describe('validateAccessToken', ()=>{
        context('access token이 주어지면', ()=>{
            it('access token을 검증해야 한다.', async ()=>{
                const userId = 1;
                const payload = {
                    userId
                };
                jest.spyOn(tokenService, 'verify').mockImplementation(()=>Promise.resolve(payload));
                jest.spyOn(usersService, 'findOne').mockResolvedValue({
                    id: userId
                });
                const result = await service.validateAccessToken('accessToken');
                expect(result).toEqual(payload);
            });
        });
    });
    describe('validateRefreshToken', ()=>{
        const oauthId = '123';
        const payload = {
            oauthId
        };
        context('refresh token이 주어지면', ()=>{
            it('refresh token을 검증해야 한다.', async ()=>{
                jest.spyOn(tokenService, 'verify').mockReturnValue(Promise.resolve(payload));
                jest.spyOn(usersService, 'findOne').mockResolvedValue({
                    oauthId: '123',
                    refreshToken: _usersfixture.mockUser.refreshToken
                });
                const result = await service.validateRefreshToken(_usersfixture.mockUser.refreshToken);
                expect(result).toEqual(payload);
            });
        });
        context('주어진 refresh token이 저장된 refresh token과 다르면', ()=>{
            it('UnauthorizedException 예외를 던져야 한다.', async ()=>{
                jest.spyOn(tokenService, 'verify').mockReturnValue(Promise.resolve(payload));
                jest.spyOn(usersService, 'findOne').mockResolvedValue({
                    oauthId: '123',
                    refreshToken: _usersfixture.mockUser.refreshToken
                });
                await expect(service.validateRefreshToken('refreshToken')).rejects.toThrow(_common.UnauthorizedException);
            });
        });
    });
});

//# sourceMappingURL=auth.service.spec.js.map