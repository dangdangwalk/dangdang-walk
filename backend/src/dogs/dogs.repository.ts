import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { AbstractRepository } from '../common/database/abstract.repository';

import { Dogs } from './dogs.entity';

@Injectable()
export class DogsRepository extends AbstractRepository<Dogs> {
    constructor(
        @InjectRepository(Dogs)
        dogsRepository: Repository<Dogs>,
        entityManager: EntityManager,
    ) {
        super(dogsRepository, entityManager);
    }
}
