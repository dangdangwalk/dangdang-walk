export type UpdateTodayWalkTimeOperation = (current: number, operand: number) => number;
export type UpdateDogWalkDayOperation = (current: number) => number;

export interface UpdateJournalData {
    memo: string;
    journalPhotos: string[];
}
