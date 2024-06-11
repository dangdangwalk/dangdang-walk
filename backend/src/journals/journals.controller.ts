import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { CreateJournalDto } from './dtos/create-journal.dto';
import { UpdateJournalDto } from './dtos/update-journal.dto';
import { AuthJournalGuard } from './guards/auth-journal.guard';
import { JournalsService } from './journals.service';
import { JournalInfoForList } from './types/journal-info.type';

import { AccessTokenPayload } from '../auth/token/token.service';
import { AuthDogGuard } from '../dogs/guards/auth-dog.guard';
import { DateValidationPipe } from '../statistics/pipes/date-validation.pipe';

import { User } from '../users/decorators/user.decorator';

@Controller('/journals')
@UsePipes(new ValidationPipe({ validateCustomDecorators: true, whitelist: true }))
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}

    @Get()
    @UseGuards(AuthDogGuard)
    async getJournalList(
        @Query('dogId', ParseIntPipe) dogId: number,
        @Query('date', DateValidationPipe) date: string,
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
    getJournalDetail(@Param('id') journalId: number) {
        return this.journalsService.getJournalDetail(journalId);
    }

    @Patch('/:id(\\d+)')
    @UseGuards(AuthJournalGuard)
    async updateJournal(@Param('id') journalId: number, @Body() body: UpdateJournalDto) {
        await this.journalsService.updateJournal(journalId, body);
        return true;
    }

    @Delete('/:id(\\d+)')
    @UseGuards(AuthJournalGuard)
    async deleteJournal(@User() user: AccessTokenPayload, @Param('id') journalId: number) {
        await this.journalsService.deleteJournal(user.userId, journalId);
        return true;
    }
}
