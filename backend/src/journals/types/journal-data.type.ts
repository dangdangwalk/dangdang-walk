export interface JournalData {
    userId: number;
    title: string;
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routes: string;
    memo?: string;
}
