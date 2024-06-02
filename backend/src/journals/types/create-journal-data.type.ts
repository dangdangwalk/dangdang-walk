import { Location, journalLocation } from '../dtos/create-journal.dto';

export interface CreateExcrementsInfo {
    dogId: number;
    fecesLocations: Location[];
    urineLocations: Location[];
}

export class CreateJournalInfo {
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    routes: journalLocation[];
    memo: string;
    photoUrls: string[];

    static getKeysForJournalTable() {
        return ['distance', 'calories', 'startedAt', 'duration', 'routes', 'memo'];
    }
    static getKeysForJournalPhotoTable() {
        return ['photoUrls'];
    }
}

export interface CreateJournalData {
    dogs: number[];
    journalInfo: CreateJournalInfo;
    excrements: CreateExcrementsInfo[];
}
