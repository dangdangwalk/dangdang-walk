declare class Excrements {
    dogId: number;
    fecesLocations: [number, number][];
    urineLocations: [number, number][];
}
declare class JournalInfo {
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routes: [number, number][];
    memo: string;
    journalPhotos: string[];
}
export declare class CreateJournalDto {
    dogs: number[];
    journalInfo: JournalInfo;
    excrements: Excrements[];
}
export {};
