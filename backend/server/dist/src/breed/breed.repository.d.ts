import { EntityManager, Repository } from 'typeorm';
import { Breed } from './breed.entity';
import { AbstractRepository } from '../common/database/abstract.repository';
export declare class BreedRepository extends AbstractRepository<Breed> {
    constructor(breedRepository: Repository<Breed>, entityManager: EntityManager);
}
