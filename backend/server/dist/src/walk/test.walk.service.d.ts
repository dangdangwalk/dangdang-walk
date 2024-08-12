import { WalkService } from './walk.service';
import { DogsService } from '../dogs/dogs.service';
import { UsersService } from '../users/users.service';
export declare class TestWalkService extends WalkService {
    constructor(usersService: UsersService, dogsService: DogsService);
    updateExpiredWalkStatus(_dogIds: number[]): Promise<void>;
}
