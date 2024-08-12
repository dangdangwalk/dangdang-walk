import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateUser } from './types/create-user.type';
import { UpdateUser } from './types/update-user.type';
import { UserProfile } from './types/user-profile.type';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { AccessTokenPayload } from '../auth/token/token.service';
import { S3Service } from '../s3/s3.service';
import { UsersDogsService } from '../users-dogs/users-dogs.service';
export declare class UsersService {
    private readonly usersRepository;
    private readonly usersDogsService;
    private readonly s3Service;
    constructor(usersRepository: UsersRepository, usersDogsService: UsersDogsService, s3Service: S3Service);
    findOne(where: FindOneOptions<Users>): Promise<Users>;
    update(
        where: FindOptionsWhere<Users>,
        partialEntity: QueryDeepPartialEntity<Users>,
    ): Promise<import('typeorm').UpdateResult>;
    updateAndFindOne(where: FindOptionsWhere<Users>, partialEntity: QueryDeepPartialEntity<Users>): Promise<Users>;
    delete(userId: number): Promise<void>;
    createIfNotExists({ oauthNickname, ...otherAttributes }: CreateUser): Promise<Users>;
    private generateUniqueNickname;
    getOwnDogsList(userId: number): Promise<number[]>;
    checkDogOwnership(userId: number, dogId: number | number[]): Promise<[boolean, number[]]>;
    getUserProfile({ userId, provider }: AccessTokenPayload): Promise<UserProfile>;
    updateUserProfile(userId: number, userInfo: UpdateUser): Promise<void>;
}
