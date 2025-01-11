import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Breed } from './breed.entity';

import { TypeORMRepository } from '../shared/database/typeorm.repository';

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
