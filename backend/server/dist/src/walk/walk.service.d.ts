import { DogsService } from '../dogs/dogs.service';
import { DogSummaryResponse } from '../dogs/types/dogs.type';
import { UsersService } from '../users/users.service';
export declare class WalkService {
    private readonly usersService;
    private readonly dogsService;
    constructor(usersService: UsersService, dogsService: DogsService);
    getAvailableDogs(userId: number): Promise<DogSummaryResponse[]>;
    protected updateExpiredWalkStatus(dogIds: number[]): Promise<void>;
}
