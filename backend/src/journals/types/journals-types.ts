export interface CreateJournalData {
    userId: number;
    title: string;
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routes: string;
    memo?: string;
}
