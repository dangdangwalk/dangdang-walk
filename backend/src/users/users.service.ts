import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { Role } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    async create(id: string, role: Role) {
        const user = await this.repo.create({ id, role });

        return this.repo.save(user);
    }

    async findOne(id: string) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id.toString());
        if (!user) {
            throw new NotFoundException('users not found');
        }

        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: string) {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('users not found');
        return this.repo.remove(user);
    }
}
