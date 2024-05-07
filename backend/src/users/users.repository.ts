import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { EntityManager, Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersRepository extends AbstractRepository<Users> {
    constructor(
        @InjectRepository(Users)
        usersRepository: Repository<Users>,
        entityManager: EntityManager
    ) {
        super(usersRepository, entityManager);
    }
}
