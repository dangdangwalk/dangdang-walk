import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { Breed } from './breed.entity';
import { BreedRepository } from './breed.repository';

@Injectable()
export class BreedService {
    constructor(private readonly breedRepository: BreedRepository) {}

    async find(where: FindOptionsWhere<Breed>): Promise<Breed[]> {
        return this.breedRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<Breed>): Promise<Breed> {
        return this.breedRepository.findOne(where);
    }

    async getRecommendedWalkAmountList(breedIds: number[]): Promise<number[]> {
        const breeds = await this.breedRepository.find({ id: In(breedIds) });

        if (!breeds.length) {
            throw new NotFoundException();
        }

        const breedMap = new Map(breeds.map((breed: Breed) => [breed.id, breed.recommendedWalkAmount]));

        return breedIds.map((breedId: number) => {
            const recommendedWalkAmount = breedMap.get(breedId);

            if (!recommendedWalkAmount) {
                throw new NotFoundException(`Recommended walk amount not found for breedId: ${breedId}.`);
            }

            return recommendedWalkAmount;
        });
    }
}
