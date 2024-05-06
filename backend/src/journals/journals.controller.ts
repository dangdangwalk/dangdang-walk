import { Controller, Post } from '@nestjs/common';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}

    @Post('/')
    fakeJournalsSave() {
        return true;
    }
}
