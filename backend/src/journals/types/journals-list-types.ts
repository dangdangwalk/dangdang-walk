import { IsDate, IsInt, IsNumber } from 'class-validator';

export class JournalInfoForList {
    @IsNumber()
    journalId: number;

    @IsInt()
    journalCnt: number;

    @IsDate()
    startedAt: Date;

    @IsNumber()
    distance: number;

    @IsNumber()
    calories: number;

    @IsNumber()
    duration: number;

    static getAttributesForJournalTable() {
        return ['journalId', 'startedAt', 'distance', 'calories', 'duration'];
    }

    static getKeysForJournalTable() {
        return ['id', 'startedAt', 'distance', 'calories', 'duration'];
    }
}
