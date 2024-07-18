import { Journals } from '../journals.entity';

export interface CreateExcrementsInfo {
    dogId: number;
    fecesLocations: [number, number][];
    urineLocations: [number, number][];
}

export class CreateJournalInfo {
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routes: [number, number][];
    memo: string;
    photoUrls: string[];

    static getKeysForJournalTable(): Array<keyof Journals> {
        return ['distance', 'calories', 'startedAt', 'duration', 'routes', 'memo'];
    }
}

export interface CreateJournalData {
    dogs: number[];
    journalInfo: CreateJournalInfo;
    excrements: CreateExcrementsInfo[];
}
