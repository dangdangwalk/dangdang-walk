import { Controller, Get } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DogsService } from './dogs.service';

export type DogProfile = {
    dogId: number;
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
        console.log('dogs:', ownDogs);
        return await this.dogsService.truncateNotAvaialableDog(ownDogs);
    }
}
