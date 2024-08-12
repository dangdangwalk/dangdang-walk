import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';

import { DateValidationPipe } from './pipes/date-validation.pipe';

import { Period, PeriodValidationPipe } from './pipes/period-validation.pipe';

import { StatisticsService } from './statistics.service';

import { AccessTokenPayload } from '../auth/token/token.service';
import { AuthDogGuard } from '../dogs/guards/auth-dog.guard';
import { User } from '../users/decorators/user.decorator';

@Controller('/dogs')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get('/:id(\\d+)/statistics/recent')
    @UseGuards(AuthDogGuard)
    async getDogMonthlyWalkingTotal(
        @User() { userId }: AccessTokenPayload,
        @Param('id', ParseIntPipe) dogId: number,
        @Query('period', new PeriodValidationPipe(['month'])) period: Period,
    ) {
        return await this.statisticsService.getDogMonthlyWalkingTotal(userId, dogId, period);
    }

    @Get('/:id(\\d+)/statistics')
    @UseGuards(AuthDogGuard)
    async getDogDailyWalkCountsByPeriod(
        @User() { userId }: AccessTokenPayload,
        @Param('id', ParseIntPipe) dogId: number,
        @Query('date', DateValidationPipe) date: string,
        @Query('period', new PeriodValidationPipe(['month', 'week'])) period: Period,
    ) {
        return await this.statisticsService.getDogDailyWalkCountsByPeriod(userId, dogId, date, period);
    }

    @Get('/statistics')
    async getDogsWeeklyWalkingOverview(@User() { userId }: AccessTokenPayload) {
        return await this.statisticsService.getDogsWeeklyWalkingOverview(userId);
    }
}
