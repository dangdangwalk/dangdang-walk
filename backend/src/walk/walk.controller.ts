import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { DogSummary } from 'src/dogs/types/dog-summary.type';
import { User } from 'src/users/decorators/user.decorator';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { DogsService } from '../dogs/dogs.service';
import { WalkCommandDto } from './dtos/walk-command.dto';
import { WalkService } from './walk.service';

@Controller('/dogs/walks')
@UsePipes(new ValidationPipe())
export class WalkController {
    constructor(
        private readonly walkService: WalkService,
        private readonly dogsService: DogsService
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
