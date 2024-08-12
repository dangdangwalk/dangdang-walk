import { PipeTransform } from '@nestjs/common';
export type Period = 'month' | 'week';
export declare class PeriodValidationPipe implements PipeTransform<string, Period> {
    private readonly allowedPeriods;
    constructor(allowedPeriods: Period[]);
    transform(value: string): Period;
}
