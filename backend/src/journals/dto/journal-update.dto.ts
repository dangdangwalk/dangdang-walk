import { IsOptional, IsUrl, ValidateNested } from 'class-validator';

export class UpdateJournalDto {
    @IsOptional()
    memo: string;

    @IsOptional()
    @ValidateNested()
    @IsUrl({}, { each: true })
    photoUrls: string[];
}
