import { DogsService } from './dogs.service';
import { CreateDogDto } from './dtos/create-dog.dto';
import { UpdateDogDto } from './dtos/update-dog.dto';
import { DogProfileResponse } from './types/dogs.type';
import { AccessTokenPayload } from '../auth/token/token.service';
export declare class DogsController {
    private readonly dogsService;
    constructor(dogsService: DogsService);
    getProfileList({ userId }: AccessTokenPayload): Promise<DogProfileResponse[]>;
    create({ userId }: AccessTokenPayload, createDogDto: CreateDogDto): Promise<void>;
    getProfile(dogId: number): Promise<DogProfileResponse>;
    update({ userId }: AccessTokenPayload, dogId: number, updateDogDto: UpdateDogDto): Promise<void>;
    delete({ userId }: AccessTokenPayload, dogId: number): Promise<void>;
}
