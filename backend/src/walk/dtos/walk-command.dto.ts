import { IsArray, IsInt } from 'class-validator';

export class WalkCommandDto {
    @IsArray()
    dogId: string[];
}
