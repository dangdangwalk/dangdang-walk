import { Injectable } from '@nestjs/common';
import { OauthProvider } from 'src/auth/auth.controller';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { S3Service } from 'src/s3/s3.service';
import { FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UsersDogsService } from '../users-dogs/users-dogs.service';
import { generateUuid } from '../utils/hash.utils';
import { checkIfExistsInArr } from '../utils/manipulate.util';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUser } from './types/user-types';
import { Role } from './user-roles.enum';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';

export interface UserProfile {
    nickname: string;
    email: string;
    profileImageUrl: string;
    provider: OauthProvider;
}

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly usersDogsService: UsersDogsService,
        private readonly s3Service: S3Service
    ) {}

    async create(entityData: CreateUser) {
        const user = new Users(entityData);
        return this.usersRepository.create(user);
    }

    async find(where: FindOptionsWhere<Users>) {
        return this.usersRepository.find({ where });
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

    async createIfNotExists({ oauthNickname, ...otherAttributes }: CreateUserDto) {
        const nickname = await this.generateUniqueNickname(oauthNickname);

        return await this.usersRepository.createIfNotExists(
            new Users({
                nickname,
                role: Role.User,
                mainDogId: null,
                ...otherAttributes,
            }),
            'oauthId'
        );
    }

    async generateUniqueNickname(nickname: string): Promise<string> {
        let randomId = generateUuid().slice(0, 10);
        let user = await this.usersRepository.findOneWithNoException({ nickname: `${nickname}#${randomId}` });

        while (user) {
            randomId = generateUuid().slice(0, 10);
            user = await this.usersRepository.findOneWithNoException({ nickname: `${nickname}#${randomId}` });
        }

        return `${nickname}#${randomId}`;
    }

    async getOwnDogsList(userId: number): Promise<number[]> {
        const foundDogs = await this.usersDogsService.find({ userId });
        return foundDogs.map((cur) => cur.dogId);
    }

    async checkDogOwnership(userId: number, dogId: number | number[]): Promise<boolean> {
        const ownDogs = await this.usersDogsService.find({ userId });
        const myDogIds = ownDogs.map((cur) => cur.dogId);

        const result = checkIfExistsInArr(myDogIds, dogId);
        return result;
    }

    async getUserProfile({ userId, provider }: AccessTokenPayload): Promise<UserProfile> {
        const { nickname, email, profileImageUrl } = await this.usersRepository.findOne({ id: userId });
        return { nickname, email, profileImageUrl, provider };
    }

    async updateUserProfile(userId: number, userInfo: UpdateUserDto) {
        const { nickname, profileImageUrl } = userInfo;

        if (nickname) {
            const nickname = await this.generateUniqueNickname(userInfo.nickname);
            userInfo.nickname = nickname;
        }

        if (profileImageUrl) {
            const curUserInfo = await this.findOne({ id: userId });
            if (curUserInfo && curUserInfo.profileImageUrl && !curUserInfo.profileImageUrl.startsWith('http')) {
                await this.s3Service.deleteSingleObject(userId, curUserInfo.profileImageUrl);
            }
        }

        await this.update({ id: userId }, userInfo);
    }
}
