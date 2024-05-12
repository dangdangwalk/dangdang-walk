export interface CreateJournalData {
    userId: number;
    title: string;
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routeImageUrl: string;
    memo?: string;
}
