import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DateValidationPipe implements PipeTransform<string, string> {
    transform(value: string): string {
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

        if (!value.match(dateFormat)) {
            throw new BadRequestException('Invalid date format. Please provide date in YYYY-MM-DD format.');
        }

        const [year, month, day] = value.split('-').map(Number);

        if (month < 1 || month > 12) {
            throw new BadRequestException(`Invalid month: ${month}. Month must be between 1 and 12.`);
        }

        const lastDayOfMonth = new Date(year, month, 0).getDate();

        if (day < 1 || day > lastDayOfMonth) {
            throw new BadRequestException(`Invalid day: ${day}. Day must be between 1 and ${lastDayOfMonth}.`);
        }

        const currentDate = new Date();
        const requestedDate = new Date(value);

        if (requestedDate > currentDate) {
            throw new BadRequestException('Date cannot be in the future.');
        }

        return value;
    }
}
