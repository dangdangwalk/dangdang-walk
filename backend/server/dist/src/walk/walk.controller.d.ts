import { WalkService } from './walk.service';
import { AccessTokenPayload } from '../auth/token/token.service';
import { DogsService } from '../dogs/dogs.service';
import { DogSummaryResponse } from '../dogs/types/dogs.type';
export declare class WalkController {
    private readonly walkService;
    private readonly dogsService;
    constructor(walkService: WalkService, dogsService: DogsService);
    startWalk(dogIds: number[]): Promise<number[]>;
    stopWalk(dogIds: number[]): Promise<number[]>;
    getAvailableDogs({ userId }: AccessTokenPayload): Promise<DogSummaryResponse[]>;
}
