import { Injectable } from '@nestjs/common';
import { DogsService } from 'src/dogs/dogs.service';
import { DogSummary } from 'src/dogs/types/dog-summary.type';
import { UsersService } from 'src/users/users.service';
import { In } from 'typeorm';

const MAX_WALK_TIME = 3;

@Injectable()
export class WalkService {
    constructor(
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService
    ) {}

    async checkAvailableDogs(dogIds: number[]) {
        for (const curDogId of dogIds) {
            const curDogInfo = await this.dogsService.findOne({ id: curDogId });
            const updatedAt = curDogInfo.updatedAt;
            const curTime = new Date();

            updatedAt.setHours(updatedAt.getHours() + MAX_WALK_TIME);
            if (curTime >= updatedAt) {
                await this.dogsService.updateIsWalking(curDogId, false);
            }
        }
    }

    async getAvailableDogs(userId: number): Promise<DogSummary[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        await this.checkAvailableDogs(ownDogIds);
        return await this.dogsService.getDogsSummaryList({ id: In(ownDogIds), isWalking: false });
    }
}
