import {
    Body,
    Controller,
    Get,
    HttpCode,
    ParseArrayPipe,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { AuthDogsGuard } from './guards/auth-dogs.guard';
import { WalkService } from './walk.service';

import { AccessTokenPayload } from '../auth/token/token.service';
import { DogsService } from '../dogs/dogs.service';
import { DogSummaryResponse } from '../dogs/types/dogs.type';

import { User } from '../users/decorators/user.decorator';

@Controller('/dogs/walks')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class WalkController {
    constructor(
        private readonly walkService: WalkService,
        private readonly dogsService: DogsService,
    ) {}

    @Post('/start')
    @HttpCode(200)
    @UseGuards(AuthDogsGuard)
    async startWalk(@Body(new ParseArrayPipe({ items: Number, separator: ',' })) dogIds: number[]): Promise<number[]> {
        return this.dogsService.updateIsWalking(dogIds, true);
    }

    @Post('/stop')
    @HttpCode(200)
    @UseGuards(AuthDogsGuard)
    async stopWalk(@Body(new ParseArrayPipe({ items: Number, separator: ',' })) dogIds: number[]): Promise<number[]> {
        return this.dogsService.updateIsWalking(dogIds, false);
    }

    @Get('/available')
    async getAvailableDogs(@User() { userId }: AccessTokenPayload): Promise<DogSummaryResponse[]> {
        return this.walkService.getAvailableDogs(userId);
    }
}
