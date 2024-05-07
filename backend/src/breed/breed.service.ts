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

    async getActivityList(ownDogs: number[]): Promise<number[]> {
        const foundBreed = await this.breedRepository.find({ id: In(ownDogs) });
        if (!foundBreed.length) {
            throw new NotFoundException();
        }
        return foundBreed.map((curBreed: Breed) => {
            return curBreed.activity;
        });
    }
}
