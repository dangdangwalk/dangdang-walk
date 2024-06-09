import { Controller, Get } from '@nestjs/common';

import { SkipAuthGuard } from '../auth/decorators/public.decorator';

import { BreedService } from './breed.service';

@Controller('/breeds')
export class BreedController {
    constructor(private readonly breedService: BreedService) {}

    @Get()
    @SkipAuthGuard()
    async getBreedData() {
        return this.breedService.getKoreanNames();
    }
}
