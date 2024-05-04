import { Controller, Get } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DogsService } from './dogs.service';
import { DogStatisticDto } from './dto/dog-statistic.dto';
import { Serialize } from 'src/common/interceptor/serialize.interceptor';
import { User } from 'src/users/decorators/user.decorator';
import { AccessTokenPayload } from 'src/auth/token/token.service';

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
        const ownDogs = await this.usersService.getDogsList(user.userId);
        return await this.dogsService.truncateNotAvaialableDog(ownDogs);
    }

    @Serialize(DogStatisticDto)
    @Get('/statistics')
    async getDogsStatistics(@User() user: AccessTokenPayload) {
        return this.dogsService.getDogsStatistics(user.userId);
    }
}
