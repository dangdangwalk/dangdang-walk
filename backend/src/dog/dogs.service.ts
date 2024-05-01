import { Injectable, NotFoundException } from '@nestjs/common';
import { Dogs } from './dogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DogProfile } from './dogs.controller';

@Injectable()
export class DogsService {
    constructor(@InjectRepository(Dogs) private repo: Repository<Dogs>) {}

    async update(id: number, attrs: Partial<Dogs>) {
        const dog = await this.repo.findOne({ where: { id } });
        if (!dog) {
            throw new NotFoundException();
        }
        Object.assign(dog, attrs);
        return this.repo.save(dog);
    }

    async updateIsWalking(dogIds: number[], stateToUpdate: boolean) {
        const attrs = {
            isWalking: stateToUpdate,
        };
        for (const curDogId of dogIds) {
            await this.update(curDogId, attrs);
        }
        return dogIds;
    }

    makeProfileList(dogs: Dogs[]): DogProfile[] {
        return dogs.map((cur) => {
            return {
                dogId: cur.id,
                name: cur.name,
                photoUrl: cur.photoUrl,
            };
        });
    }

    async truncateNotAvaialableDog(dogIds: number[]): Promise<DogProfile[]> {
        //: Promise<dogProfile[]> {
        const availableDogList = await this.repo.find({ where: { id: In(dogIds), isWalking: false } });
        const availableDogProfileList = this.makeProfileList(availableDogList);
        console.log(availableDogProfileList);
        return availableDogProfileList;
    }
}
