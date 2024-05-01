import { Controller, Get } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DogsService } from './dogs.service';
import { BreedService } from 'src/breed/breed.service';

export type DogProfile = {
    dogId: number;
    name: string;
    photoUrl: string;
};

@Controller('dogs')
export class DogsController {
    constructor(
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService,
        private readonly breedService: BreedService
    ) {}

    @Get('/walk-available')
    async getAvailableDogs(): Promise<DogProfile[]> {
        const ownDogs = await this.usersService.getDogsList(1);
        return await this.dogsService.truncateNotAvaialableDog(ownDogs);
    }

    @Get('/statistics')
    async getDogsStatistics() {
        const ownDogs = await this.usersService.getDogsList(1);
        const mininumActivies = await this.breedService.getActivityList(ownDogs);
        //const walkDays await
        console.log(mininumActivies);
    }
}
