import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UsersDogs } from './users-dogs.entity';

import { AbstractRepository } from '../common/database/abstract.repository';

@Injectable()
export class UsersDogsRepository extends AbstractRepository<UsersDogs> {
    constructor(
        @InjectRepository(UsersDogs)
        usersDogsRepository: Repository<UsersDogs>,
        entityManager: EntityManager,
    ) {
        super(usersDogsRepository, entityManager);
    }
}
