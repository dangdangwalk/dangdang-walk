import { Injectable, NotFoundException } from '@nestjs/common';
import { Dogs } from './dogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DogService {
    constructor(@InjectRepository(Dogs) private repo: Repository<Dogs>) {}

    async update(id: number, attrs: Partial<Dogs>) {
        const dog = await this.repo.findOne({ where: { id } });
        if (!dog) {
            throw new NotFoundException();
        }
        return this.repo.save(dog);
    }
}
