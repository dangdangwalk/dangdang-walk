import { Controller, Post } from '@nestjs/common';
import { ExcrementsService } from '../excrements/excrements.service';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
    constructor(
        private readonly journalsService: JournalsService,
        private readonly excrementsService: ExcrementsService
    ) {}

    @Post('/')
    fakeJournalsSave() {
        return true;
    }
}
