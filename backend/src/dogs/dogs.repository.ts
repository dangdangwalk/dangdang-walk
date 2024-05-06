import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { EntityManager, Repository } from 'typeorm';
import { Dogs } from './dogs.entity';

@Injectable()
export class DogsRepository extends AbstractRepository<Dogs> {
    constructor(
        @InjectRepository(Dogs)
        dogsRepository: Repository<Dogs>,
        entityManager: EntityManager
    ) {
        super(dogsRepository, entityManager);
    }
}
