import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository, EntityManager } from 'typeorm';
import { Role } from './user-roles.enum';
import { generateUuid } from '../utils/hash.utils';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private userRepo: Repository<Users>,
        @InjectEntityManager() private entityManager: EntityManager
    ) {}

    async create(
        nickname: string,
        role: Role,
        mainDogId: number,
        oauthId: string,
        oauthAccessToken: string,
        oauthRefreshToken: string,
        refreshToken: string
    ) {
        const user = await this.userRepo.create({
            nickname,
            role,
            mainDogId,
            oauthId,
            oauthAccessToken,
            oauthRefreshToken,
            refreshToken,
        });

        return this.userRepo.save(user);
    }

    async findOne(id: number) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async update(id: number, attrs: Partial<Users>) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('users not found');
        }
        Object.assign(user, attrs);
        return this.userRepo.save(user);
    }

    //TODO : row를 지우지 않고 상태만 탈퇴로 바꾼다
    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('users not found');
        return this.userRepo.remove(user);
    }

    /**
     * 주어진 userId를 가진 사용자가 존재하지 않으면 새로운 사용자를 생성합니다.
     * 사용자가 이미 존재하면 true를 반환하고, 새로운 사용자가 생성되었으면 false를 반환합니다.
     *
     * @param userId - 사용자의 고유 식별자입니다.
     * @param role - 사용자의 역할입니다. 제공되지 않으면 기본값은 'User'입니다.
     * @returns 사용자가 이미 존재하면 true를, 새로운 사용자가 생성되었으면 false를 반환하는 Promise입니다.
     */
    async isMemberOrCreate(userId: number, role: Role | undefined = Role.User): Promise<boolean> {
        let isMember = true;
        await this.entityManager.transaction(async (transactionalEntityManager) => {
            const foundUser = await transactionalEntityManager.findOne(Users, { where: { id: userId } });
            if (!foundUser) {
                let uuid: string = generateUuid();

                let duplicatedUser = await transactionalEntityManager.findOne(Users, { where: { nickname: uuid } });
                while (duplicatedUser) {
                    duplicatedUser = await transactionalEntityManager.findOne(Users, { where: { nickname: uuid } });
                    uuid = generateUuid();
                }

                const newUser = transactionalEntityManager.create(Users, { id: userId, role, nickname: uuid });
                await transactionalEntityManager.save(newUser);
                isMember = false;
            }
        });
        return isMember;
    }
}
