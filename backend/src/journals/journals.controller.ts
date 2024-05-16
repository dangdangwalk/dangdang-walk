import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { User } from 'src/users/decorators/user.decorator';
import { UpdateJournalDto } from './dto/journal-update.dto';
import { CreateJournalDto } from './dto/journals-create.dto';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}

    @Get('/:id(\\d+)')
    getJournalDetail(
        @User() user: AccessTokenPayload,
        @Param('id', ParseIntPipe) journalId: number,
        @Query('dogId', ParseIntPipe) dogId: number
    ) {
        if (!this.journalsService.checkJournalOwnership(user.userId, journalId)) {
            throw new ForbiddenException(`User ${user.userId} does not have access to journal ${journalId}`);
        }
        try {
            return this.journalsService.getJournalDetail(journalId, dogId);
        } catch (e) {
            throw e;
        }
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
