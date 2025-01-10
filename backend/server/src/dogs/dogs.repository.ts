import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Dogs } from './dogs.entity';

import { TypeORMRepository } from '../shared/database/typeorm.repository';

@Injectable()
export class DogsRepository extends TypeORMRepository<Dogs> {
    constructor(
        @InjectRepository(Dogs)
        dogsRepository: Repository<Dogs>,
        entityManager: EntityManager,
    ) {
        super(dogsRepository, entityManager);
    }
}
