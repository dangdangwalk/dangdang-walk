export declare const mockJournals: (
    | {
          userId: number;
          routes: string;
          calories: number;
          memo: string;
          startedAt: string;
          duration: number;
          distance: number;
      }
    | {
          userId: number;
          routes: string;
          calories: number;
          startedAt: string;
          duration: number;
          distance: number;
          memo?: undefined;
      }
)[];
export declare const mockJournalsDog: {
    journalId: number;
    dogId: number;
}[];
