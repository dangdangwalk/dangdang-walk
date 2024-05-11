import { Controller, ForbiddenException, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { User } from 'src/users/decorators/user.decorator';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}

    @Post('/')
    fakeJournalsSave() {
        return true;
    }

    @Get('/')
    getJournalDetail(
        @User() user: AccessTokenPayload,
        @Query('journalId', ParseIntPipe) journalId: number,
        @Query('dogId', ParseIntPipe) dogId: number
    ) {
        if (!this.journalsService.checkJournalOwnership(user.userId, journalId)) {
            throw new ForbiddenException('허용되지 않은 접근입니다');
        }
        return this.journalsService.getJournalDetail(journalId, dogId);
    }
}
