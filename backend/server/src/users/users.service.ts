import { Injectable } from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { CreateUser } from './types/create-user.type';
import { ROLE } from './types/role.type';
import { UpdateUser } from './types/update-user.type';
import { UserProfile } from './types/user-profile.type';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';

import { AccessTokenPayload } from '../auth/token/token.service';
import { S3Service } from '../s3/s3.service';
import { UsersDogsService } from '../users-dogs/users-dogs.service';
import { generateUuid } from '../utils/hash.util';
import { checkIfExistsInArr } from '../utils/manipulate.util';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly usersDogsService: UsersDogsService,
        private readonly s3Service: S3Service,
    ) {}

    async findOne(where: FindOneOptions<Users>) {
        return await this.usersRepository.findOne(where);
    }

    async update(where: FindOptionsWhere<Users>, partialEntity: QueryDeepPartialEntity<Users>) {
        return await this.usersRepository.update(where, partialEntity);
    }

    async updateAndFindOne(where: FindOptionsWhere<Users>, partialEntity: QueryDeepPartialEntity<Users>) {
        return await this.usersRepository.updateAndFindOne(where, partialEntity);
    }

    async delete(userId: number) {
        await this.usersRepository.delete({ id: userId });
        await this.s3Service.deleteObjectFolder(userId);
    }

    async createIfNotExists({ oauthNickname, ...otherAttributes }: CreateUser) {
        const nickname = await this.generateUniqueNickname(oauthNickname);

        return await this.usersRepository.createIfNotExists(
            new Users({
                nickname,
                role: ROLE.User,
                mainDogId: null,
                ...otherAttributes,
            }),
            'oauthId',
        );
    }

    private async generateUniqueNickname(nickname: string): Promise<string> {
        let randomId = generateUuid().slice(0, 10);
        let user = await this.usersRepository.findOneWithNoException({ nickname: `${nickname}#${randomId}` });

        while (user) {
            randomId = generateUuid().slice(0, 10);
            user = await this.usersRepository.findOneWithNoException({ nickname: `${nickname}#${randomId}` });
        }

        return `${nickname}#${randomId}`;
    }

    async getOwnDogsList(userId: number): Promise<number[]> {
        return (await this.usersDogsService.find({ where: { userId }, select: ['dogId'] })).map((cur) => cur.dogId);
    }

    async checkDogOwnership(userId: number, dogId: number | number[]): Promise<[boolean, number[]]> {
        const myDogIds = (await this.usersDogsService.find({ where: { userId }, select: ['dogId'] })).map(
            (cur) => cur.dogId,
        );

        return checkIfExistsInArr(myDogIds, dogId);
    }

    async getUserProfile({ userId, provider }: AccessTokenPayload): Promise<UserProfile> {
        const { nickname, email, profileImageUrl } = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['nickname', 'email', 'profileImageUrl'],
        });

        return { nickname, email, profileImageUrl, provider };
    }

    async updateUserProfile(userId: number, userInfo: UpdateUser) {
        const { nickname, profileImageUrl } = userInfo;

        if (nickname) {
            const nickname = await this.generateUniqueNickname(userInfo.nickname);
            userInfo.nickname = nickname;
        }

        if (profileImageUrl) {
            const curUserInfo = await this.usersRepository.findOne({ where: { id: userId } });
            if (curUserInfo && curUserInfo.profileImageUrl) {
                await this.s3Service.deleteSingleObject(userId, curUserInfo.profileImageUrl);
            }
        }

        await this.usersRepository.update({ id: userId }, userInfo);
    }
}
