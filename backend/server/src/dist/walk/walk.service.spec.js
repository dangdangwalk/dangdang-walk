"use strict";
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _walkservice = require("./walk.service");
const _dogsentity = require("../dogs/dogs.entity");
const _dogsservice = require("../dogs/dogs.service");
const _usersservice = require("../users/users.service");
describe('WalkService', ()=>{
    let service;
    let usersService;
    let dogsService;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _walkservice.WalkService,
                _usersservice.UsersService,
                {
                    provide: _usersservice.UsersService,
                    useValue: {
                        getOwnDogsList: jest.fn()
                    }
                },
                {
                    provide: _dogsservice.DogsService,
                    useValue: {
                        getDogsSummaryList: jest.fn(),
                        findOne: jest.fn(),
                        updateIsWalking: jest.fn()
                    }
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_dogsentity.Dogs),
                    useClass: _typeorm1.Repository
                }
            ]
        }).compile();
        service = module.get(_walkservice.WalkService);
        usersService = module.get(_usersservice.UsersService);
        dogsService = module.get(_dogsservice.DogsService);
    });
    describe('getAvailableDogs', ()=>{
        const userId = 1;
        const ownDogIds = [
            1,
            2,
            3
        ];
        const availableDogs = [
            {
                id: 1,
                name: 'dangdang1',
                profilePhotoUrl: 'https://example.com/dog1.jpg'
            },
            {
                id: 2,
                name: 'dangdang2',
                profilePhotoUrl: 'https://example.com/dog2.jpg'
            }
        ];
        context('사용자 id가 주어지면', ()=>{
            beforeEach(()=>{
                jest.spyOn(usersService, 'getOwnDogsList').mockResolvedValueOnce(ownDogIds);
                jest.spyOn(service, 'updateExpiredWalkStatus').mockResolvedValueOnce();
                jest.spyOn(dogsService, 'getDogsSummaryList').mockResolvedValue(availableDogs);
            });
            it('소유한 강아지 목록을 반환한다.', async ()=>{
                const dogSummaries = await service.getAvailableDogs(userId);
                expect(dogSummaries).toEqual([
                    {
                        id: 1,
                        name: 'dangdang1',
                        profilePhotoUrl: 'https://example.com/dog1.jpg'
                    },
                    {
                        id: 2,
                        name: 'dangdang2',
                        profilePhotoUrl: 'https://example.com/dog2.jpg'
                    }
                ]);
            });
        });
    });
});

//# sourceMappingURL=walk.service.spec.js.map