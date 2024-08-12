import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Users } from './users.entity';

import { AbstractRepository } from '../common/database/abstract.repository';

@Injectable()
export class UsersRepository extends AbstractRepository<Users> {
    constructor(
        @InjectRepository(Users)
        usersRepository: Repository<Users>,
        entityManager: EntityManager,
    ) {
        super(usersRepository, entityManager);
    }
}
