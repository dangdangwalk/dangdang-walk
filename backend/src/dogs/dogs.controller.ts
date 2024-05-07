import { Controller, Get, InternalServerErrorException, Param, ParseIntPipe } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { Serialize } from 'src/common/interceptor/serialize.interceptor';
import { User } from 'src/users/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';
import { In } from 'typeorm';
import { DogsService } from './dogs.service';
import { DogStatisticDto } from './dto/dog-statistic.dto';

export type DogProfile = {
    id: number;
    name: string;
    photoUrl: string;
};

@Controller('dogs')
export class DogsController {
    constructor(
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService
    ) {}

    @Get('/walk-available')
    async getAvailableDogs(@User() user: AccessTokenPayload): Promise<DogProfile[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(user.userId);
        return await this.dogsService.getProfileList({ id: In(ownDogIds), isWalking: false });
    }

    @Serialize(DogStatisticDto)
    @Get('/statistics')
    async getDogsStatistics(@User() user: AccessTokenPayload) {
        return this.dogsService.getDogsStatistics(user.userId);
    }

    @Get('/:id')
    async getOneProfile(@User() user: AccessTokenPayload, @Param('id', ParseIntPipe) dogId: number) {
        const owned = await this.usersService.checkDogOwnership(user.userId, dogId);
        if (!owned) {
            throw new InternalServerErrorException('주인이 아닌 강아지에 대한 요청 ');
        }
        return this.dogsService.getProfile(dogId);
    }
}
