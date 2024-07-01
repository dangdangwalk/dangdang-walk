import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export type Period = 'month' | 'week';

@Injectable()
export class PeriodValidationPipe implements PipeTransform<string, Period> {
    private readonly allowedPeriods;

    constructor(allowedPeriods: Period[]) {
        this.allowedPeriods = allowedPeriods;
    }

    transform(value: string): Period {
        if (!value) {
            throw new BadRequestException('period query parameter is missing.');
        }

        if (!this.allowedPeriods.includes(value as Period)) {
            throw new BadRequestException(
                `Invalid period: ${value}. Allowed periods are: ${this.allowedPeriods.join(', ')}`,
            );
        }

        return value as Period;
    }
}
