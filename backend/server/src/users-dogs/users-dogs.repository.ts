import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UsersDogs } from './users-dogs.entity';

import { TypeORMRepository } from '../shared/database/typeorm.repository';

@Injectable()
export class UsersDogsRepository extends TypeORMRepository<UsersDogs> {
    constructor(
        @InjectRepository(UsersDogs)
        usersDogsRepository: Repository<UsersDogs>,
        entityManager: EntityManager,
    ) {
        super(usersDogsRepository, entityManager);
    }
}
