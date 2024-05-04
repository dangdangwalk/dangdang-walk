export interface CreateJournal {
    userId: number;
    title: string;
    logImageUrl: string;
    calories: number;
    memo: string;
    startedAt: Date;
    duration: number;
    distance: number;
}
