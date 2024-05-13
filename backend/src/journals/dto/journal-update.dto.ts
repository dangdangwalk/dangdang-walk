import { IsOptional, IsUrl, ValidateNested } from 'class-validator';

export class UpdateJournalDto {
    @IsOptional()
    title: string;

    @IsOptional()
    memo: string;

    @IsOptional()
    @ValidateNested()
    @IsUrl({}, { each: true })
    photoUrls: string[];
}
