import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, UpdateResult } from 'typeorm';

import { Users } from './users.entity';

import { UsersRepository } from './users.repository';

import { UsersService } from './users.service';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { mockUser } from '../fixtures/users.fixture';
import { S3Service } from '../s3/s3.service';
import { UsersDogs } from '../users-dogs/users-dogs.entity';
import { UsersDogsRepository } from '../users-dogs/users-dogs.repository';
import { UsersDogsService } from '../users-dogs/users-dogs.service';

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: Repository<Users>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                UsersRepository,
                UsersDogsService,
                UsersDogsRepository,
                EntityManager,
                {
                    provide: S3Service,
                    useValue: { deleteSingleObject: jest.fn() },
                },
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
    });

    describe('findOne', () => {
        context('사용자가 존재 할 때', () => {
            beforeEach(() => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
            });

            it('사용자 정보를 반환해야 한다.', async () => {
                const res = await service.findOne({ where: { id: mockUser.id } });

                expect(res).toEqual(mockUser);
            });
        });

        context('사용자가 존재하지 않을 때', () => {
            beforeEach(() => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            });

            it('NotFoundException 예외를 던져야 한다.', async () => {
                await expect(service.findOne({ where: { id: 1 } })).rejects.toThrow(NotFoundException);
            });
        });
    });

    describe('updateAndFindOne', () => {
        context('사용자 토큰 정보가 주어지고 사용자가 존재하면', () => {
            beforeEach(() => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
                jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);
            });

            it('사용자 정보를 업데이트하고 사용자를 반환해야 한다.', async () => {
                const res = await service.updateAndFindOne(
                    { oauthId: mockUser.oauthId },
                    {
                        oauthAccessToken: mockUser.oauthAccessToken,
                        oauthRefreshToken: mockUser.oauthRefreshToken,
                        refreshToken: mockUser.refreshToken,
                    },
                );

                expect(res).toBe(mockUser);
                expect(userRepository.findOne).toHaveBeenCalledWith({ where: { oauthId: mockUser.oauthId } });
                expect(userRepository.update).toHaveBeenCalledWith(
                    { oauthId: mockUser.oauthId },
                    {
                        oauthAccessToken: mockUser.oauthAccessToken,
                        oauthRefreshToken: mockUser.oauthRefreshToken,
                        refreshToken: mockUser.refreshToken,
                    },
                );
            });
        });

        context('사용자 토큰 정보가 주어지고 사용자가 존재하지 않으면', () => {
            beforeEach(() => {
                jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 0 } as UpdateResult);
            });

            it('NotFoundException 예외를 던져야 한다.', async () => {
                await expect(
                    service.updateAndFindOne(
                        { oauthId: mockUser.oauthId },
                        {
                            oauthAccessToken: mockUser.oauthAccessToken,
                            oauthRefreshToken: mockUser.oauthRefreshToken,
                            refreshToken: mockUser.refreshToken,
                        },
                    ),
                ).rejects.toThrow(NotFoundException);
            });
        });
    });

    describe('createIfNotExists', () => {
        context('사용자 토큰 정보가 주어지고 사용자가 존재하면', () => {
            beforeEach(() => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce(mockUser);
            });

            it('ConflictException 예외를 던져야 한다.', async () => {
                await expect(
                    service.createIfNotExists({
                        oauthNickname: 'modifyTest',
                        email: 'test@mail.com',
                        profileImageUrl: 'test.jpg',
                        oauthId: mockUser.oauthId,
                        oauthAccessToken: mockUser.oauthAccessToken,
                        oauthRefreshToken: mockUser.oauthRefreshToken,
                        refreshToken: mockUser.refreshToken,
                    }),
                ).rejects.toThrow(ConflictException);
            });
        });
    });
});
