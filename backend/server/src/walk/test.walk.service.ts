import { Injectable } from '@nestjs/common';

import { WalkService } from './walk.service';

import { DogsService } from '../dogs/dogs.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TestWalkService extends WalkService {
    constructor(usersService: UsersService, dogsService: DogsService) {
        super(usersService, dogsService);
    }

    async updateExpiredWalkStatus(_dogIds: number[]) {
        return Promise.resolve();
    }
}
