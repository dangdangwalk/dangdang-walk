import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { EntityManager, Repository } from 'typeorm';
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
