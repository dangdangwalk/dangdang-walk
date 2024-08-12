"use strict";
const _common = require("@nestjs/common");
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _breedentity = require("./breed.entity");
const _breedrepository = require("./breed.repository");
const _breedservice = require("./breed.service");
const _breedfixture = require("../fixtures/breed.fixture");
describe('BreedService', ()=>{
    let service;
    let breedRepository;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _breedservice.BreedService,
                _breedrepository.BreedRepository,
                _typeorm1.EntityManager,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_breedentity.Breed),
                    useClass: _typeorm1.Repository
                }
            ]
        }).compile();
        service = module.get(_breedservice.BreedService);
        breedRepository = module.get((0, _typeorm.getRepositoryToken)(_breedentity.Breed));
    });
    describe('findOne', ()=>{
        context('견종 조회 할 때', ()=>{
            beforeEach(()=>{
                jest.spyOn(breedRepository, 'findOne').mockResolvedValue(_breedfixture.mockBreed);
            });
            it('견종 정보를 반환해야 한다.', async ()=>{
                const breed = await service.findOne({
                    where: {
                        id: 1
                    }
                });
                expect(breed).toEqual({
                    id: 1,
                    englishName: 'Poodle',
                    koreanName: '푸들',
                    recommendedWalkAmount: 60
                });
            });
        });
    });
    describe('getKoreanNames', ()=>{
        context('견종의 한국어 이름을 조회할 때', ()=>{
            const mockBreedList = [
                {
                    englishName: 'Poodle',
                    id: 1,
                    koreanName: '푸들',
                    recommendedWalkAmount: 60
                },
                {
                    englishName: 'Airedale Terrier',
                    id: 2,
                    koreanName: '에어데일 테리어',
                    recommendedWalkAmount: 1800
                }
            ];
            beforeEach(()=>{
                jest.spyOn(breedRepository, 'find').mockResolvedValue(mockBreedList);
            });
            it('견종의 한국어 이름 리스트를 반환한다.', async ()=>{
                const breed = await service.getKoreanNames();
                expect(breed).toEqual([
                    '푸들',
                    '에어데일 테리어'
                ]);
            });
        });
        context('견종 목록이 존재하지 않으면', ()=>{
            beforeEach(()=>{
                jest.spyOn(breedRepository, 'find').mockResolvedValue([]);
            });
            it('NotFoundException 예외를 던져야 한다.', async ()=>{
                await expect(service.getKoreanNames()).rejects.toThrow(new _common.NotFoundException('견종 목록을 찾을 수 없습니다.'));
            });
        });
    });
    describe('getRecommendedWalkAmountList', ()=>{
        const mockBreedList = [
            {
                englishName: 'Poodle',
                id: 1,
                koreanName: '푸들',
                recommendedWalkAmount: 60
            },
            {
                englishName: 'Airedale Terrier',
                id: 2,
                koreanName: '에어데일 테리어',
                recommendedWalkAmount: 1800
            }
        ];
        const breedIds = [
            1,
            2
        ];
        const not_exist_BreedIds = [
            999,
            1000
        ];
        beforeEach(()=>{
            jest.spyOn(breedRepository, 'find').mockResolvedValue(mockBreedList);
        });
        context('견종 id가 주어지면', ()=>{
            it('해당 견종의 권장 산책량 리스트를 반환해야 한다.', async ()=>{
                const recommendWalk = await service.getRecommendedWalkAmountList(breedIds);
                expect(recommendWalk).toEqual([
                    60,
                    1800
                ]);
            });
        });
        context('견종 id가 존재하지 않으면', ()=>{
            it('NotFoundException 예외를 던져야 한다.', async ()=>{
                await expect(service.getRecommendedWalkAmountList(not_exist_BreedIds)).rejects.toThrow(new _common.NotFoundException('999에 대한 권장 산책량을 찾을 수 없습니다.'));
            });
        });
        context('견종 목록이 빈 값이면', ()=>{
            beforeEach(()=>{
                jest.spyOn(breedRepository, 'find').mockResolvedValue([]);
            });
            it('NotFoundException 예외를 던져야 한다.', async ()=>{
                await expect(service.getRecommendedWalkAmountList(not_exist_BreedIds)).rejects.toThrow(new _common.NotFoundException('999,1000 해당 견종을 찾을 수 없습니다.'));
            });
        });
    });
});

//# sourceMappingURL=breed.service.spec.js.map