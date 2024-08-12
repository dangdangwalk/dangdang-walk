import { BreedService } from './breed.service';
export declare class BreedController {
    private readonly breedService;
    constructor(breedService: BreedService);
    getBreedData(): Promise<string[]>;
}
