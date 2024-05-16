import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AuthDogGuard } from 'src/dogs/guards/authDog.guard';
import { AccessTokenPayload } from '../auth/token/token.service';
import { User } from '../users/decorators/user.decorator';
import { DateValidationPipe } from './pipes/dateValidation.pipe';
import { StatisticsService } from './statistics.service';

@Controller('dogs')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get('/:id(\\d+)/statistics')
    @UseGuards(AuthDogGuard)
    async getDogStatistics(
        @User() { userId }: AccessTokenPayload,
        @Param('id', ParseIntPipe) dogId: number,
        @Query('date', DateValidationPipe) date: string
    ) {
        return await this.statisticsService.getDogStatistics(userId, dogId, date);
    }

    @Get('/statistics')
    async getDogsStatistics(@User() { userId }: AccessTokenPayload) {
        return await this.statisticsService.getDogsStatistics(userId);
    }
}
