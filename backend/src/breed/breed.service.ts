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

    async getRecommendedWalkAmountList(ownDogs: number[]): Promise<number[]> {
        const breeds = await this.breedRepository.find({ id: In(ownDogs) });
        if (!breeds.length) {
            throw new NotFoundException();
        }
        return breeds.map((breed: Breed) => {
            return breed.recommendedWalkAmount;
        });
    }
}
