import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { DateValidationPipe } from 'src/statistics/pipes/date-validation.pipe';
import { User } from 'src/users/decorators/user.decorator';
import { JournalInfoForList } from './dtos/journal-list.dto';
import { UpdateJournalDto } from './dtos/journal-update.dto';
import { CreateJournalDto } from './dtos/journals-create.dto';
import { AuthJournalGuard } from './guards/auth-journal.guard';
import { JournalsService } from './journals.service';

@Controller('/journals')
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}

    @Get()
    async getJournalList(
        @Query('dogId', ParseIntPipe) dogId: number,
        @Query('date', DateValidationPipe) date: string
    ): Promise<JournalInfoForList[]> {
        return await this.journalsService.getJournalList(dogId, date);
    }

    @Post()
    async createJournal(@User() user: AccessTokenPayload, @Body() body: CreateJournalDto) {
        await this.journalsService.createJournal(user.userId, body);
        return true;
    }

    @Get('/:id(\\d+)')
    @UseGuards(AuthJournalGuard)
    getJournalDetail(@Param('id', ParseIntPipe) journalId: number) {
        return this.journalsService.getJournalDetail(journalId);
    }

    @Patch('/:id(\\d+)')
    async updateJournal(@Param('id', ParseIntPipe) journalId: number, @Body() body: UpdateJournalDto) {
        await this.journalsService.updateJournal(journalId, body);
        return true;
    }

    @Delete('/:id(\\d+)')
    async deleteJournal(@User() user: AccessTokenPayload, @Param('id', ParseIntPipe) journalId: number) {
        await this.journalsService.deleteJournal(user.userId, journalId);
        return true;
    }
}
