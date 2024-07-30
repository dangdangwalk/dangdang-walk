import { httpClient } from '@/api/http';
import { DogAvatar } from '@/models/dog';
import { Journal } from '@/models/journal';
import { Coords } from '@/models/location';
import { formatDate } from '@/utils/time';

export const fetchJournals = async (dogId: number, date: string = formatDate(new Date())): Promise<Journal[]> => {
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
        routes: Coords[];
        journalPhotos: string[];
        memo: string;
    };
    excrements: Array<Excrement>;
}

interface Excrement {
    dogId: number;
    fecesLocations: Array<Coords>;
    urineLocations: Array<Coords>;
}

export interface JournalDetail {
    journalInfo: {
        id: number;
        routes: Array<Coords>;
        memo: string;
        journalPhotos: Array<string>;
        excrementCount?: Array<ExcrementCounts>;
    };
    dogs: Array<DogAvatar>;
}

interface ExcrementCounts {
    dogId: number;
    fecesCnt: number;
    urineCnt: number;
}

interface JournalUpdateForm {
    memo?: string;
    journalPhotos?: Array<string>;
}
