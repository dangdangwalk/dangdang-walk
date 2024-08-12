import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
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
import { JournalListResponse } from './types/journal.types';

import { AccessTokenPayload } from '../auth/token/token.service';
import { AuthDogGuard } from '../dogs/guards/auth-dog.guard';
import { DateValidationPipe } from '../statistics/pipes/date-validation.pipe';

import { User } from '../users/decorators/user.decorator';
import { AuthDogsGuard } from '../walk/guards/auth-dogs.guard';

@Controller('/journals')
@UsePipes(new ValidationPipe({ validateCustomDecorators: true, whitelist: true }))
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}

    @Get()
    @UseGuards(AuthDogGuard)
    async getJournalList(
        @Query('dogId', ParseIntPipe) dogId: number,
        @Query('date', DateValidationPipe) date: string,
        @User() user: AccessTokenPayload,
    ): Promise<JournalListResponse[]> {
        return await this.journalsService.getJournalList(user.userId, dogId, date);
    }

    @Post()
    @UseGuards(AuthDogsGuard)
    async createJournal(@User() user: AccessTokenPayload, @Body() body: CreateJournalDto) {
        await this.journalsService.createJournal(user.userId, body);
    }

    @Get('/:id(\\d+)')
    @UseGuards(AuthJournalGuard)
    getJournalDetail(@Param('id', ParseIntPipe) journalId: number) {
        return this.journalsService.getJournalDetail(journalId);
    }

    @Patch('/:id(\\d+)')
    @HttpCode(204)
    @UseGuards(AuthJournalGuard)
    async updateJournal(@Param('id', ParseIntPipe) journalId: number, @Body() body: UpdateJournalDto) {
        await this.journalsService.updateJournal(journalId, body);
    }

    @Delete('/:id(\\d+)')
    @HttpCode(204)
    @UseGuards(AuthJournalGuard)
    async deleteJournal(@User() user: AccessTokenPayload, @Param('id', ParseIntPipe) journalId: number) {
        await this.journalsService.deleteJournal(user.userId, journalId);
    }
}
