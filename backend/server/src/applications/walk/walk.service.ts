import { Injectable } from '@nestjs/common';

import { In } from 'typeorm';

import { DogsService } from '../dogs/dogs.service';
import { DogSummaryResponse } from '../dogs/types/dogs.type';
import { UsersService } from '../users/users.service';

const MAX_WALK_TIME = 3;

@Injectable()
export class WalkService {
    constructor(
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService,
    ) {}

    async getAvailableDogs(userId: number): Promise<DogSummaryResponse[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        await this.updateExpiredWalkStatus(ownDogIds);

        return await this.dogsService.getDogsSummaryList({ id: In(ownDogIds), isWalking: false });
    }

    protected async updateExpiredWalkStatus(dogIds: number[]) {
        const dogs = await this.dogsService.find({
            where: { id: In(dogIds) },
            select: ['id', 'isWalking', 'updatedAt'],
        });

        const expiredWalkDogIds = dogs
            .filter((dog) => {
                if (!dog.isWalking) return false;

                const expirationTime = dog.updatedAt;
                expirationTime.setHours(expirationTime.getHours() + MAX_WALK_TIME);

                return new Date() >= expirationTime;
            })
            .map((dog) => dog.id);

        if (expiredWalkDogIds.length > 0) {
            await this.dogsService.updateIsWalking(expiredWalkDogIds, false);
        }
    }
}
