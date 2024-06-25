import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export type Period = 'month' | 'week';

@Injectable()
export class PeriodValidationPipe implements PipeTransform<Period, Period> {
    private readonly allowedPeriods;

    constructor(allowedPeriods: Period[]) {
        this.allowedPeriods = allowedPeriods;
    }

    transform(value: Period): Period {
        if (!value) {
            throw new BadRequestException('period query parameter is missing.');
        }

        if (!this.allowedPeriods.includes(value)) {
            throw new BadRequestException(
                `Invalid period: ${value}. Allowed periods are: ${this.allowedPeriods.join(', ')}`,
            );
        }

        return value;
    }
}
