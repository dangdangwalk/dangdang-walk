import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Breed } from './breed.entity';

import { AbstractRepository } from '../common/database/abstract.repository';

@Injectable()
export class BreedRepository extends AbstractRepository<Breed> {
    constructor(
        @InjectRepository(Breed)
        breedRepository: Repository<Breed>,
        entityManager: EntityManager,
    ) {
        super(breedRepository, entityManager);
    }
}
