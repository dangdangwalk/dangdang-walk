import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../common/database/abstract.repository';
import { UsersDogs } from './users-dogs.entity';

@Injectable()
export class UsersDogsRepository extends AbstractRepository<UsersDogs> {
    constructor(
        @InjectRepository(UsersDogs)
        usersDogsRepository: Repository<UsersDogs>,
        entityManager: EntityManager
    ) {
        super(usersDogsRepository, entityManager);
    }
}
