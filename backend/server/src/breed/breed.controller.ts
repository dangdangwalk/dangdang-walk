import { Controller, Get } from '@nestjs/common';

import { BreedService } from './breed.service';

import { SkipAuthGuard } from '../auth/decorators/public.decorator';

@Controller('/breeds')
export class BreedController {
    constructor(private readonly breedService: BreedService) {}

    @Get()
    @SkipAuthGuard()
    async getBreedData() {
        return this.breedService.getKoreanNames();
    }
}
