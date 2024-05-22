import { httpClient } from '@/api/http';
import { Journal } from '@/models/journals';
import { Position as NumberPosition, Position } from '@/models/location.model';
import { formDate } from '@/utils/date';

export const fetchJournals = async (dogId: number, date: string = formDate(new Date())): Promise<Journal[]> => {
    const { data } = await httpClient.get(`/journals?dogId=${dogId}&date=${date}`);

    return data;
};

export const create = async (form: JournalCreateForm) => {
    await httpClient.post('/journals', form);
};

export const update = async (journalId: number, form: JournalUpdateForm) => {
    await httpClient.patch(`/journals/${journalId}`, form);
};

export const remove = async (journalId: number) => {
    await httpClient.delete(`/journals/${journalId}`);
};

export const fetchJournal = async (journalId: number) => {
    const { data } = await httpClient.get<JournalDetail>(`/journals/${journalId}`);

    return data;
};

interface JournalCreateForm {
    dogs: Array<number>;
    journalInfo: {
        distance: number;
        calories: number;
        startedAt: string;
        duration: number;
        routes: Array<NumberPosition>;
        photoUrls: string[];
        memo: string;
    };
    excrements: Array<Excrement>;
}

interface Excrement {
    dogId: number;
    fecesLocations: Array<StringPosition>;
    urineLocations: Array<StringPosition>;
}

interface StringPosition {
    lat: string;
    lng: string;
}

export interface JournalDetail {
    journalInfo: {
        id: number;
        routes: Array<Position>;
        memo: string;
        photoUrls: Array<string>;
    };
    dogs: Array<Dog>;
    excrements?: Array<ExcrementCounts>;
}

interface Dog {
    id: number;
    name: string;
    profilePhotoUrl: string;
}

interface ExcrementCounts {
    dogId: number;
    fecesCnt: number;
    urineCnt: number;
}

interface JournalUpdateForm {
    memo?: string;
    photoUrls?: Array<string>;
}
