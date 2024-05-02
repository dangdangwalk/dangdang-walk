import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Breed } from './breed.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class BreedService {
    constructor(@InjectRepository(Breed) private breedRepo: Repository<Breed>) {}

    async getActivityList(ownDogs: number[]): Promise<number[]> {
        const foundBreed = await this.breedRepo.find({ where: { id: In(ownDogs) } });
        if (!foundBreed) throw NotFoundException;

        return foundBreed.map((curBreed: Breed) => {
            return curBreed.activity;
        });
    }
}
