import { IsArray, IsInt } from 'class-validator';

export class WalkCommand {
    @IsArray()
    @IsInt({ each: true })
    dog_id: number[];
}
