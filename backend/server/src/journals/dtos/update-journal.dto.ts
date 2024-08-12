import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateJournalDto {
    @IsOptional()
    @IsString()
    memo: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    journalPhotos: string[];
}
