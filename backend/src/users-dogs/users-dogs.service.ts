import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { UsersDogs } from './users-dogs.entity';
import { UsersDogsRepository } from './users-dogs.repository';

@Injectable()
export class UsersDogsService {
    constructor(private readonly usersDogsRepository: UsersDogsRepository) {}

    async create(entityData: UsersDogs) {
        const userDog = new UsersDogs(entityData);
        return await this.usersDogsRepository.create(userDog);
    }

    async find(where: FindManyOptions<UsersDogs>) {
        return await this.usersDogsRepository.find(where);
    }
}
