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

    async delete(where: FindOptionsWhere<Users>) {
        return this.usersRepository.delete(where);
    }

    async loginOrCreateUser(
        oauthId: string,
        oauthAccessToken: string,
        oauthRefreshToken: string,
        refreshToken: string
    ) {
        let user = await this.findOne({ oauthId });

        if (!user) {
            const nickname = await this.generateUniqueNickname();
            user = await this.create({
                nickname,
                role: Role.User,
                mainDogId: undefined,
                oauthId,
                oauthAccessToken,
                oauthRefreshToken,
                refreshToken,
            });
        } else {
            await this.update({ oauthId }, { oauthAccessToken, oauthRefreshToken, refreshToken });
        }

        return user.id;
    }

    async generateUniqueNickname(): Promise<string> {
        let nickname = generateUuid();
        let user = await this.findOne({ nickname });

        while (user) {
            nickname = generateUuid();
            user = await this.findOne({ nickname });
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
