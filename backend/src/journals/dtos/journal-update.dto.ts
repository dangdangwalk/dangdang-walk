import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateJournalDto {
    @IsOptional()
    memo: string;

    @IsOptional()
    @ValidateNested()
    @IsString({ each: true })
    photoUrls: string[];
}
