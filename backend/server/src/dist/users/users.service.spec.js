"use strict";
const _common = require("@nestjs/common");
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _usersentity = require("./users.entity");
const _usersrepository = require("./users.repository");
const _usersservice = require("./users.service");
const _winstonLoggerservice = require("../common/logger/winstonLogger.service");
const _usersfixture = require("../fixtures/users.fixture");
const _s3service = require("../s3/s3.service");
const _usersdogsentity = require("../users-dogs/users-dogs.entity");
const _usersdogsrepository = require("../users-dogs/users-dogs.repository");
const _usersdogsservice = require("../users-dogs/users-dogs.service");
describe('UsersService', ()=>{
    let service;
    let userRepository;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _usersservice.UsersService,
                _usersrepository.UsersRepository,
                _usersdogsservice.UsersDogsService,
                _usersdogsrepository.UsersDogsRepository,
                _typeorm1.EntityManager,
                {
                    provide: _s3service.S3Service,
                    useValue: {
                        deleteSingleObject: jest.fn()
                    }
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_usersentity.Users),
                    useClass: _typeorm1.Repository
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_usersdogsentity.UsersDogs),
                    useClass: _typeorm1.Repository
                },
                {
                    provide: _winstonLoggerservice.WinstonLoggerService,
                    useValue: {}
                }
            ]
        }).compile();
        service = module.get(_usersservice.UsersService);
        userRepository = module.get((0, _typeorm.getRepositoryToken)(_usersentity.Users));
    });
    describe('findOne', ()=>{
        context('사용자가 존재 할 때', ()=>{
            beforeEach(()=>{
                jest.spyOn(userRepository, 'findOne').mockResolvedValue(_usersfixture.mockUser);
            });
            it('사용자 정보를 반환해야 한다.', async ()=>{
                const res = await service.findOne({
                    where: {
                        id: _usersfixture.mockUser.id
                    }
                });
                expect(res).toEqual(_usersfixture.mockUser);
            });
        });
        context('사용자가 존재하지 않을 때', ()=>{
            beforeEach(()=>{
                jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            });
            it('NotFoundException 예외를 던져야 한다.', async ()=>{
                await expect(service.findOne({
                    where: {
                        id: 1
                    }
                })).rejects.toThrow(_common.NotFoundException);
            });
        });
    });
    describe('updateAndFindOne', ()=>{
        context('사용자 토큰 정보가 주어지고 사용자가 존재하면', ()=>{
            beforeEach(()=>{
                jest.spyOn(userRepository, 'findOne').mockResolvedValue(_usersfixture.mockUser);
                jest.spyOn(userRepository, 'update').mockResolvedValue({
                    affected: 1
                });
            });
            it('사용자 정보를 업데이트하고 사용자를 반환해야 한다.', async ()=>{
                const res = await service.updateAndFindOne({
                    oauthId: _usersfixture.mockUser.oauthId
                }, {
                    oauthAccessToken: _usersfixture.mockUser.oauthAccessToken,
                    oauthRefreshToken: _usersfixture.mockUser.oauthRefreshToken,
                    refreshToken: _usersfixture.mockUser.refreshToken
                });
                expect(res).toBe(_usersfixture.mockUser);
                expect(userRepository.findOne).toHaveBeenCalledWith({
                    where: {
                        oauthId: _usersfixture.mockUser.oauthId
                    }
                });
                expect(userRepository.update).toHaveBeenCalledWith({
                    oauthId: _usersfixture.mockUser.oauthId
                }, {
                    oauthAccessToken: _usersfixture.mockUser.oauthAccessToken,
                    oauthRefreshToken: _usersfixture.mockUser.oauthRefreshToken,
                    refreshToken: _usersfixture.mockUser.refreshToken
                });
            });
        });
        context('사용자 토큰 정보가 주어지고 사용자가 존재하지 않으면', ()=>{
            beforeEach(()=>{
                jest.spyOn(userRepository, 'update').mockResolvedValue({
                    affected: 0
                });
            });
            it('NotFoundException 예외를 던져야 한다.', async ()=>{
                await expect(service.updateAndFindOne({
                    oauthId: _usersfixture.mockUser.oauthId
                }, {
                    oauthAccessToken: _usersfixture.mockUser.oauthAccessToken,
                    oauthRefreshToken: _usersfixture.mockUser.oauthRefreshToken,
                    refreshToken: _usersfixture.mockUser.refreshToken
                })).rejects.toThrow(_common.NotFoundException);
            });
        });
    });
    describe('createIfNotExists', ()=>{
        context('사용자 토큰 정보가 주어지고 사용자가 존재하면', ()=>{
            beforeEach(()=>{
                jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce(_usersfixture.mockUser);
            });
            it('ConflictException 예외를 던져야 한다.', async ()=>{
                await expect(service.createIfNotExists({
                    oauthNickname: 'modifyTest',
                    email: 'test@mail.com',
                    profileImageUrl: 'test.jpg',
                    oauthId: _usersfixture.mockUser.oauthId,
                    oauthAccessToken: _usersfixture.mockUser.oauthAccessToken,
                    oauthRefreshToken: _usersfixture.mockUser.oauthRefreshToken,
                    refreshToken: _usersfixture.mockUser.refreshToken
                })).rejects.toThrow(_common.ConflictException);
            });
        });
    });
});

//# sourceMappingURL=users.service.spec.js.map