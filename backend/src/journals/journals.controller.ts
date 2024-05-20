import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { User } from 'src/users/decorators/user.decorator';
import { UpdateJournalDto } from './dto/journal-update.dto';
import { CreateJournalDto } from './dto/journals-create.dto';
import { AuthJournalGuard } from './guards/authJournal.guard';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}

    @Get('/:id(\\d+)')
    @UseGuards(AuthJournalGuard)
    getJournalDetail(@Param('id', ParseIntPipe) journalId: number, @Query('dogId', ParseIntPipe) dogId: number) {
        return this.journalsService.getJournalDetail(journalId, dogId);
    }

    @Post('/')
    async createJournal(@User() user: AccessTokenPayload, @Body() body: CreateJournalDto) {
        await this.journalsService.createJournal(user.userId, body);
        return true;
    }

    @Patch('/:id(\\d+)')
    async updateJournal(@Param('id', ParseIntPipe) journalId: number, @Body() body: UpdateJournalDto) {
        await this.journalsService.updateJournal(journalId, body);
        return true;
    }

    @Delete('/:id(\\d+)')
    async deleteJournal(@Param('id', ParseIntPipe) journalId: number) {
        await this.journalsService.deleteJournal(journalId);
        return true;
    }
}
