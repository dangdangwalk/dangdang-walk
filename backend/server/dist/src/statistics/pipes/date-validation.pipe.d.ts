import { PipeTransform } from '@nestjs/common';
export declare class DateValidationPipe implements PipeTransform<string, string> {
    transform(value: string): string;
}
