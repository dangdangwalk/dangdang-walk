import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersDogs } from './userDogs.entity';
import { mockUser } from '../fixture/users.fixture';
import { NotFoundException } from '@nestjs/common';

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
});
