import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { AbstractRepository } from '../common/database/abstract.repository';

import { Users } from './users.entity';

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
