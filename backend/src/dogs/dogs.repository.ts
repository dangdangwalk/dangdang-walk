import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Dogs } from './dogs.entity';

import { AbstractRepository } from '../common/database/abstract.repository';

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
