import { Controller, Get } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DogsService } from './dogs.service';
import { BreedService } from 'src/breed/breed.service';
import { DogWalkDayService } from 'src/dog-walk-day/dog-walk-day.service';
import { DogStatisticDto } from './dto/dog-statistic.dto';
import { Serialize } from 'src/common/interceptor/serialize.interceptor';

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
    async getAvailableDogs(): Promise<DogProfile[]> {
        const ownDogs = await this.usersService.getDogsList(1);
        return await this.dogsService.truncateNotAvaialableDog(ownDogs);
    }

    @Serialize(DogStatisticDto)
    @Get('/statistics')
    async getDogsStatistics() {
        return this.dogsService.getDogsStatistics();
    }
}
