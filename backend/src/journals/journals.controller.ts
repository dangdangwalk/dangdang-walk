import { Controller, Get } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { WalkJournals } from './walk-journals.entity';

@Controller('journals')
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}
}
