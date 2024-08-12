import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, In } from 'typeorm';

import { Breed } from './breed.entity';
import { BreedRepository } from './breed.repository';

@Injectable()
export class BreedService {
    constructor(private readonly breedRepository: BreedRepository) {}

    async findOne(where: FindOneOptions<Breed>): Promise<Breed> {
        return this.breedRepository.findOne(where);
    }

    async getKoreanNames(): Promise<string[]> {
        const breeds = await this.breedRepository.find({ select: ['koreanName'] });

        if (!breeds.length) {
            throw new NotFoundException(`견종 목록을 찾을 수 없습니다.`);
        }

        return breeds.map((breed) => breed.koreanName);
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
