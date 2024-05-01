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
        Object.assign(dog, attrs);
        return this.repo.save(dog);
    }

    async updateIsWalking(dogIdArr: number[], stateToUpdate: boolean) {
        const attrs = {
            isWalking: stateToUpdate,
        };
        for (const curDogId of dogIdArr) {
            await this.update(curDogId, attrs);
        }
        return dogIdArr;
    }
}
