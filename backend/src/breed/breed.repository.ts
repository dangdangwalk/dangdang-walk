import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../common/database/abstract.repository';
import { Breed } from './breed.entity';

@Injectable()
export class BreedRepository extends AbstractRepository<Breed> {
    constructor(
        @InjectRepository(Breed)
        breedRepository: Repository<Breed>,
        entityManager: EntityManager
    ) {
        super(breedRepository, entityManager);
    }
}
