import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { FindOneOptions, In } from 'typeorm';

import { Breed } from './breed.entity';
import { BreedRepository } from './breed.repository';

import { CACHE_TTL } from '../../shared/utils/etc';

@Injectable()
export class BreedService {
    private static readonly BREED_NAMES_CACHE_KEY = 'breeds:koreanNames';

    constructor(
        private readonly breedRepository: BreedRepository,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async findOne(where: FindOneOptions<Breed>): Promise<Breed> {
        return this.breedRepository.findOne(where);
    }

    async getKoreanNames(): Promise<string[]> {
        const cached = await this.cacheManager.get<string[]>(BreedService.BREED_NAMES_CACHE_KEY);

        if (cached) {
            return cached;
        }

        const breeds = await this.breedRepository.find({ select: ['koreanName'] });

        if (!breeds.length) {
            throw new NotFoundException(`견종 목록을 찾을 수 없습니다.`);
        }

        const names = breeds.map((breed) => breed.koreanName);
        await this.cacheManager.set(BreedService.BREED_NAMES_CACHE_KEY, names, CACHE_TTL.BREED_NAMES);

        return names;
    }

    async getRecommendedWalkAmountList(breedIds: number[]): Promise<number[]> {
        const breeds = await this.breedRepository.find({
            where: { id: In(breedIds) },
            select: ['id', 'recommendedWalkAmount'],
        });

        if (!breeds.length) {
            throw new NotFoundException(`${breedIds} 해당 견종을 찾을 수 없습니다.`);
        }

        const breedMap = new Map(breeds.map((breed: Breed) => [breed.id, breed.recommendedWalkAmount]));

        return breedIds.map((breedId: number) => {
            const recommendedWalkAmount = breedMap.get(breedId);

            if (!recommendedWalkAmount) {
                throw new NotFoundException(`${breedId}에 대한 권장 산책량을 찾을 수 없습니다.`);
            }

            return recommendedWalkAmount;
        });
    }
}
