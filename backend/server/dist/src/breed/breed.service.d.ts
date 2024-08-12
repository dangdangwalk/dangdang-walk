import { FindOneOptions } from 'typeorm';
import { Breed } from './breed.entity';
import { BreedRepository } from './breed.repository';
export declare class BreedService {
    private readonly breedRepository;
    constructor(breedRepository: BreedRepository);
    findOne(where: FindOneOptions<Breed>): Promise<Breed>;
    getKoreanNames(): Promise<string[]>;
    getRecommendedWalkAmountList(breedIds: number[]): Promise<number[]>;
}
