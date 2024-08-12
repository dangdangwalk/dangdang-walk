import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DogSummaryResponse } from 'server/src/dogs/types/dogs.type';
import { Repository } from 'typeorm';

import { TestWalkService } from './test.walk.service';
import { WalkService } from './walk.service';

import { Dogs } from '../dogs/dogs.entity';
import { DogsService } from '../dogs/dogs.service';
import { UsersService } from '../users/users.service';

describe('WalkService', () => {
    let service: TestWalkService;
    let usersService: UsersService;
    let dogsService: DogsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WalkService,
                UsersService,
                {
                    provide: UsersService,
                    useValue: {
                        getOwnDogsList: jest.fn(),
                    },
                },
                {
                    provide: DogsService,
                    useValue: {
                        getDogsSummaryList: jest.fn(),
                        findOne: jest.fn(),
                        updateIsWalking: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Dogs),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<TestWalkService>(WalkService);
        usersService = module.get<UsersService>(UsersService);
        dogsService = module.get<DogsService>(DogsService);
    });

    describe('getAvailableDogs', () => {
        const userId = 1;
        const ownDogIds = [1, 2, 3];
        const availableDogs: DogSummaryResponse[] = [
            { id: 1, name: 'dangdang1', profilePhotoUrl: 'https://example.com/dog1.jpg' },
            { id: 2, name: 'dangdang2', profilePhotoUrl: 'https://example.com/dog2.jpg' },
        ];

        context('사용자 id가 주어지면', () => {
            beforeEach(() => {
                jest.spyOn(usersService, 'getOwnDogsList').mockResolvedValueOnce(ownDogIds);
                jest.spyOn(service, 'updateExpiredWalkStatus').mockResolvedValueOnce();
                jest.spyOn(dogsService, 'getDogsSummaryList').mockResolvedValue(availableDogs);
            });

            it('소유한 강아지 목록을 반환한다.', async () => {
                const dogSummaries = await service.getAvailableDogs(userId);

                expect(dogSummaries).toEqual([
                    { id: 1, name: 'dangdang1', profilePhotoUrl: 'https://example.com/dog1.jpg' },
                    { id: 2, name: 'dangdang2', profilePhotoUrl: 'https://example.com/dog2.jpg' },
                ]);
            });
        });
    });
});
