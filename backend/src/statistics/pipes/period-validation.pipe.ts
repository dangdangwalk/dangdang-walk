import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const allowedPeriods = ['month', 'week'] as const;
export type Period = (typeof allowedPeriods)[number];

@Injectable()
export class PeriodValidationPipe implements PipeTransform<Period, Period> {
    readonly allowedPeriods = allowedPeriods;

    transform(value: Period): Period {
        if (!value) {
            throw new BadRequestException('period query parameter is missing.');
        }

        if (!this.allowedPeriods.includes(value)) {
            throw new BadRequestException(
                `Invalid period: ${value}. Allowed periods are: ${this.allowedPeriods.join(', ')}`
            );
        }

        return value;
    }
}
