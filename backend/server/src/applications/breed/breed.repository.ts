import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeORMRepository } from 'shared/database';
import { EntityManager, Repository } from 'typeorm';

import { Breed } from './breed.entity';

@Injectable()
export class BreedRepository extends TypeORMRepository<Breed> {
    constructor(
        @InjectRepository(Breed)
        breedRepository: Repository<Breed>,
        entityManager: EntityManager,
    ) {
        super(breedRepository, entityManager);
    }
}
