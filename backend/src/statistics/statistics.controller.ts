import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccessTokenPayload } from '../auth/token/token.service';
import { AuthDogGuard } from '../dogs/guards/auth-dog.guard';
import { User } from '../users/decorators/user.decorator';
import { DateValidationPipe } from './pipes/date-validation.pipe';
import { Period, PeriodValidationPipe } from './pipes/period-validation.pipe';
import { StatisticsService } from './statistics.service';

@Controller('/dogs')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get('/:id(\\d+)/statistics/recent')
    @UseGuards(AuthDogGuard)
    async getDogStatistics(
        @User() { userId }: AccessTokenPayload,
        @Param('id', ParseIntPipe) dogId: number,
        @Query('period', PeriodValidationPipe) period: Period,
    ) {
        return await this.statisticsService.getDogStatistics(userId, dogId, period);
    }

    @Get('/:id(\\d+)/statistics')
    @UseGuards(AuthDogGuard)
    async getDogWalkCnt(
        @User() { userId }: AccessTokenPayload,
        @Param('id', ParseIntPipe) dogId: number,
        @Query('date', DateValidationPipe) date: string,
        @Query('period', PeriodValidationPipe) period: Period,
    ) {
        return await this.statisticsService.getDogWalkCnt(userId, dogId, date, period);
    }

    @Get('/statistics')
    async getDogsStatistics(@User() { userId }: AccessTokenPayload) {
        return await this.statisticsService.getDogsStatistics(userId);
    }
}
