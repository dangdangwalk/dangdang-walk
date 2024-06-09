import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { WalkCommandDto } from './dtos/walk-command.dto';

import { WalkService } from './walk.service';

import { AccessTokenPayload } from '../auth/token/token.service';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { DogsService } from '../dogs/dogs.service';
import { DogSummary } from '../dogs/types/dog-summary.type';
import { User } from '../users/decorators/user.decorator';

@Controller('/dogs/walks')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class WalkController {
    constructor(
        private readonly walkService: WalkService,
        private readonly dogsService: DogsService,
    ) {}

    @Serialize(WalkCommandDto)
    @Post('/start')
    async startWalk(@Body() body: WalkCommandDto): Promise<number[]> {
        const dogIds = [];
        for (const curId of body.dogId) {
            dogIds.push(parseInt(curId));
        }
        await this.dogsService.updateIsWalking(dogIds, true);
        return dogIds;
    }

    @Serialize(WalkCommandDto)
    @Post('/stop')
    async stopWalk(@Body() body: WalkCommandDto): Promise<number[]> {
        const dogIds = [];
        for (const curId of body.dogId) {
            dogIds.push(parseInt(curId));
        }
        await this.dogsService.updateIsWalking(dogIds, false);
        return dogIds;
    }

    @Get('/available')
    async getAvailableDogs(@User() { userId }: AccessTokenPayload): Promise<DogSummary[]> {
        return await this.walkService.getAvailableDogs(userId);
    }
}
