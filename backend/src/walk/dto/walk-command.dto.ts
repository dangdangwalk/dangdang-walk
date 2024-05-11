import { IsArray } from 'class-validator';

export class WalkCommandDto {
    @IsArray()
    dogId: string[];
}
