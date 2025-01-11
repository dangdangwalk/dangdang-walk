import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Users } from './users.entity';

import { TypeORMRepository } from '../shared/database/typeorm.repository';

@Injectable()
export class UsersRepository extends TypeORMRepository<Users> {
    constructor(
        @InjectRepository(Users)
        usersRepository: Repository<Users>,
        entityManager: EntityManager,
    ) {
        super(usersRepository, entityManager);
    }
}
