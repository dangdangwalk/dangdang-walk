import { Injectable } from '@nestjs/common';
import { UsersDogsService } from 'src/users-dogs/users-dogs.service';
import { FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { generateUuid } from '../utils/hash.utils';
import { CreateUser } from './types/user-types';
import { Role } from './user-roles.enum';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly usersDogsService: UsersDogsService
    ) {}

    async create(entityData: CreateUser) {
        const user = new Users(entityData);
        return this.usersRepository.create(user);
    }

    async find(where: FindOptionsWhere<Users>) {
        return this.usersRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<Users>) {
        return this.usersRepository.findOne(where);
    }

    async update(where: FindOptionsWhere<Users>, partialEntity: QueryDeepPartialEntity<Users>) {
        return this.usersRepository.update(where, partialEntity);
    }

    async updateAndFindOne(where: FindOptionsWhere<Users>, partialEntity: QueryDeepPartialEntity<Users>) {
        return this.usersRepository.updateAndFindOne(where, partialEntity);
    }

    async delete(where: FindOptionsWhere<Users>) {
        return this.usersRepository.delete(where);
    }

    async createIfNotExists(
        oauthId: string,
        oauthAccessToken: string,
        oauthRefreshToken: string,
        refreshToken: string
    ) {
        const nickname = await this.generateUniqueNickname();

        return await this.usersRepository.createIfNotExists(
            { oauthId },
            new Users({
                nickname,
                role: Role.User,
                mainDogId: null,
                oauthId,
                oauthAccessToken,
                oauthRefreshToken,
                refreshToken,
            })
        );
    }

    async generateUniqueNickname(): Promise<string> {
        let nickname = generateUuid();
        let user = await this.usersRepository.findOneRaw({ nickname });

        while (user) {
            nickname = generateUuid();
            user = await this.usersRepository.findOneRaw({ nickname });
        }

        return nickname;
    }

    async getOwnDogsList(userId: number): Promise<number[]> {
        const foundDogs = await this.usersDogsService.find({ userId });
        return foundDogs.map((cur) => cur.dogId);
    }

    async checkDogOwnership(userId: number, dogId: number | number[]): Promise<boolean> {
        const ownDogs = await this.usersDogsService.find({ userId });
        const myDogIds = ownDogs.map((cur) => cur.dogId);

        return Array.isArray(dogId) ? dogId.every((id) => myDogIds.includes(id)) : myDogIds.includes(dogId);
    }
}
