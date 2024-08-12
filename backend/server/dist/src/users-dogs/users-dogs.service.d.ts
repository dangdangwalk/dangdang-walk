import { FindManyOptions } from 'typeorm';
import { UsersDogs } from './users-dogs.entity';
import { UsersDogsRepository } from './users-dogs.repository';
export declare class UsersDogsService {
    private readonly usersDogsRepository;
    constructor(usersDogsRepository: UsersDogsRepository);
    create(entityData: UsersDogs): Promise<UsersDogs>;
    find(where: FindManyOptions<UsersDogs>): Promise<UsersDogs[]>;
}
