import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';

import { mockBreed } from '../fixtures/breed.fixture';

import { BreedService } from './breed.service';
import { BreedRepository } from './breed.repository';
import { Breed } from './breed.entity';

const context = describe;

describe('BreedService', () => {
    let service: BreedService;
    let breedRepository: Repository<Breed>;
    let repository: BreedRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BreedService,
                BreedRepository,
                EntityManager,
                {
                    provide: getRepositoryToken(Breed),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<BreedService>(BreedService);
        breedRepository = module.get<Repository<Breed>>(getRepositoryToken(Breed));
    });

    describe('findOne', () => {
        context('견종 조회 할 때', () => {
            beforeEach(() => {
                jest.spyOn(breedRepository, 'findOne').mockResolvedValue(mockBreed);
            });

            it('견종 정보를 반환해야 한다.', async () => {
                const breed = await service.findOne({ id: 1 });

                expect(breed).toEqual({
                    id: 1,
                    englishName: 'Poodle',
                    koreanName: '푸들',
                    recommendedWalkAmount: 60,
                });
            });
        });
    });
});
