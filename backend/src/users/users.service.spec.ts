import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersDogs } from './user-dogs.entity';
import { mockUser } from '../fixture/users.fixture';
import { NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';

const context = describe;

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: Repository<Users>;
    let usersDogsRepository: Repository<UsersDogs>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(Users),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(UsersDogs),
                    useClass: Repository,
                },
                {
                    provide: WinstonLoggerService,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
        usersDogsRepository = module.get<Repository<UsersDogs>>(getRepositoryToken(UsersDogs));
    });

    describe('findOne', () => {
        context('사용자가 존재 할 때', () => {
            beforeEach(() => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
            });

            it('사용자 정보를 리턴해야 한다.', async () => {
                const res = await service.findOne(mockUser.id);

                expect(res).toEqual(mockUser);
            });
        });

        context('사용자가 존재하지 않을 때', () => {
            beforeEach(() => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            });

            it('NotFoundException 예외를 던져야 한다.', async () => {
                await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
            });
        });
    });

    describe('loginOrCreateUser', () => {
        context('사용자 토큰 정보가 주어지고 사용자가 존재하지 않으면', () => {
            beforeEach(() => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
                jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
                jest.spyOn(service, 'generateUniqueNickname').mockResolvedValue('unique-nickname');
                jest.spyOn(service, 'create').mockResolvedValue({ id: 1 } as Users);
            });

            it('사용자 정보를 저장하고 사용자 id를 리턴해야 한다.', async () => {
                const res = await service.loginOrCreateUser(
                    mockUser.oauthId,
                    mockUser.oauthAccessToken,
                    mockUser.oauthRefreshToken,
                    mockUser.refreshToken
                );

                expect(res).toBe(1);
                expect(userRepository.save).toHaveBeenCalledWith({ ...mockUser });
                expect(userRepository.findOne).toHaveBeenCalledWith({ where: { oauthId: mockUser.oauthId } });
            });
        });
    });
});
