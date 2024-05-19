import { Injectable, NotFoundException } from '@nestjs/common';
import { DogSummary } from 'src/dogs/dogs.controller';
import { DogsService } from 'src/dogs/dogs.service';
import { JournalsDogsService } from 'src/journals-dogs/journals-dogs.service';
import { JournalsService } from 'src/journals/journals.service';
import { UsersService } from 'src/users/users.service';
import { In } from 'typeorm';

@Injectable()
export class WalkService {
    constructor(
        private readonly usersService: UsersService,
        private readonly journalsDogsService: JournalsDogsService,
        private readonly journalsService: JournalsService,
        private readonly dogsService: DogsService
    ) {}

    async checkAvailableDogs(dogIds: number[], recentJournalIds: (number | undefined)[]) {
        if (dogIds.length !== recentJournalIds.length) {
            throw new NotFoundException('checkAvailableDogs | Data not match; check dogIds, recentJournalIds');
        }
        for (let i = 0; i < dogIds.length; i++) {
            const recentJournalInfo = await this.journalsService.findOne({ id: recentJournalIds[i] });
            const recentWalkStartTime = new Date(recentJournalInfo.startedAt);
            const curTime = new Date();
            recentWalkStartTime.setHours(recentWalkStartTime.getHours() + 3);
            if (curTime >= recentWalkStartTime) {
                await this.dogsService.updateIsWalking(dogIds[i], false);
            }
        }
    }

    async getAvailableDogs(userId: number): Promise<DogSummary[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        const recentJournalIds = await this.journalsDogsService.getRecentJournalId(ownDogIds);
        await this.checkAvailableDogs(ownDogIds, recentJournalIds);
        return await this.dogsService.getDogsSummaryList({ id: In(ownDogIds), isWalking: false });
    }
}
